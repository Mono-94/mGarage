local Target = exports.ox_target

local ZoneData = {}
local TextuiZone = {}
local PolyZone = {}

local SendZones = function()
    local filteredData = {}
    for _, v in pairs(ZoneData) do
        if v ~= nil then
            table.insert(filteredData, v)
        end
    end
    SendNUI("GarageZones", filteredData)
end

local SetBlip = function(data)
    local entity = AddBlipForCoord(data.actioncoords.x, data.actioncoords.y, data.actioncoords.z)
    SetBlipSprite(entity, 50)
    SetBlipDisplay(entity, 4)
    SetBlipScale(entity, 0.5)
    SetBlipColour(entity, 0)
    SetBlipAsShortRange(entity, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(data.name)
    EndTextCommandSetBlipName(entity)
    return entity
end

local SetNPC = function(data)
    local hashkey = GetHashKey(data.npchash)
    RequestModel(hashkey)

    while not HasModelLoaded(hashkey) do
        Wait(1)
    end

    local entity = CreatePed(2, data.npchash, data.actioncoords.x, data.actioncoords.y, data.actioncoords.z,
        data.actioncoords.w, false, false)
    SetPedFleeAttributes(entity, 0, 0)
    SetPedDiesWhenInjured(entity, false)
    TaskStartScenarioInPlace(entity, "missheistdockssetup1clipboard@base", 0, true)
    SetPedKeepTask(entity, true)
    SetBlockingOfNonTemporaryEvents(entity, true)
    SetEntityInvincible(entity, true)
    FreezeEntityPosition(entity, true)
    return entity
end


local DeleteZone = function(id)
    if ZoneData[id].zoneType == 'target' then
        Target:removeZone(ZoneData[id].TargetId)
    elseif ZoneData[id].zoneType == 'textui' then
        TextuiZone[id]:remove()
    end

    if DoesEntityExist(ZoneData[id].npcEntity) then
        DeleteEntity(ZoneData[id].npcEntity)
    end

    if DoesBlipExist(ZoneData[id].blipEntity) then
        RemoveBlip(ZoneData[id].blipEntity)
    end

    PolyZone[id]:remove()

    ZoneData[id] = nil

    if not ZoneData[id] then
        return true
    else
        return false
    end
end



lib.callback('mGarage:GarageZones', false, function(response)
    if response then
        for k, v in pairs(response) do
            local eng = json.decode(v.garage)
            eng.name  = v.name
            eng.id    = v.id
            CreateGarage(eng)
        end
    end
end, 'getZones')



function CreateTargetImpound(data)
    if data.garagetype == 'impound' --[[and data.job]] then
        if data.society then
            label = 'Impound' .. data.society
        else
            label = 'Impound'
        end
        exports.ox_target:addGlobalVehicle({
            {
                label = label,
                onSelect = function(vehicle)
                    local input = lib.inputDialog('Dialog title', {
                        { type = 'textarea', label = 'Reason', description = 'Some input description',  required = true, },
                        { type = 'number',   label = 'Price',  description = 'Some number description', icon = 'money',  min = 1, max = 100000 },
                    })

                    if not input then return end

                    local State = Entity(vehicle.entity).state

                    print(State.id, State.Owner, State.type, State.temporary)

                    local data = {
                        -- vehicle info
                        owner = State.owner,
                        plate = State.plate or GetVehicleNumberPlateText(vehicle.entity),
                        entity = VehToNet(vehicle.entity),

                        --  impound info
                        price = input[2],
                        reason = input[1],
                        garage = data.name
                    }

                    lib.callback.await('mGarage:Interact', false, 'setimpound', data)
                end
            }
        })
    end
end

function CreateGarage(data)
    if not ZoneData[data.id] then ZoneData[data.id] = data end

    if type(data.points) ~= 'table' then
        data.points = json.decode(data.points)
    end

    if data.blip then
        ZoneData[data.id].blipEntity = SetBlip(data)
    end

    PolyZone[data.id] = lib.zones.poly({
        name = data.name .. '-garage',
        points = data.points,
        thickness = data.thickness,
        debug = data.debug,
        -- inside = function()
        --     print('inside')
        -- end,
        onEnter = function()
            if data.zoneType == 'target' then
                if not data.npchash or data.npchash == '' then
                    data.npchash = 'csb_trafficwarden'
                end
                ZoneData[data.id].npcEntity = SetNPC(data)
                if data.job == '' or 'false' or false then
                   data.jop = false
                end

                ZoneData[data.id].TargetId = Target:addBoxZone({
                    coords = { data.actioncoords.x, data.actioncoords.y, data.actioncoords.z + 1 },
                    size = vec3(1, 1, 1.5),
                    rotation = data.actioncoords.w,

                    debug = data.debug,
                    drawSprite = true,
                    options = {
                        {
                            label = data.name,
                            icon = "fa-solid fa-warehouse",
                            groups = data.job,
                            canInteract = function()
                                return true
                            end,
                            onSelect = function()
                                OpenGarage(data)
                            end
                        },
                    }
                })
                if data.garagetype == 'garage' then
                    Target:addGlobalVehicle({
                        {
                            name = 'mGarage:SaveTarget',
                            icon = 'fa-solid fa-road',
                            label = 'Save Car',
                            groups = data.job,
                            distance = 3.0,
                            canInteract = function(entity, distance, coords, name, bone)
                                return Entity(entity).state.Spawned
                            end,
                            onSelect = function(vehicle)
                                data.entity = VehToNet(vehicle.entity)
                                data.props = json.encode(lib.getVehicleProperties(vehicle.entity))

                                lib.callback.await('mGarage:Interact', false, 'saveCar', data)
                            end
                        },
                    })
                end
            elseif data.zoneType == 'textui' then
                local zone = {}
                TextuiZone[data.id] = zone
            end
        end,
        onExit = function()
            if ZoneData[data.id].zoneType == 'target' then
                if DoesEntityExist(ZoneData[data.id].npcEntity) then
                    DeleteEntity(ZoneData[data.id].npcEntity)
                end
                Target:removeZone(ZoneData[data.id].TargetId)
                exports.ox_target:removeGlobalVehicle({ 'mGarage:SaveTarget' })
            elseif ZoneData[data.id].zoneType == 'textui' then

            end
        end
    })
end

if Config.DefaultGarages then
    for k, v in pairs(Config.GaragesDefault) do
        v.id = k + 42094
        v.default = true
        CreateGarage(v)
        CreateTargetImpound(v)
    end
end


RegisterNetEvent('mGarage:Zone', function(action, data)
    if action == 'add' then
        CreateGarage(data)
    elseif action == 'delete' then
        local check = DeleteZone(data)
        if check then
            SendZones()
        end
    elseif action == 'update' then
        local check = DeleteZone(data.id)
        if check then
            CreateGarage(data)
        end
    end
end)

local promi = nil

local GarageAdmAction = function(action, data, delay)
    return lib.callback.await('mGarage:GarageZones', delay or false, action, data)
end

RegisterNuiCallback('mGarage:adm', function(data, cb)
    local retval
    if data.action == 'create' then
        retval = GarageAdmAction('create', data.data)
    elseif data.action == 'zone' then
        ShowNui('setVisibleMenu', false)
        promi = promise:new()
        CreateZone('mGarage:ExitZone_' .. #ZoneData + 1, function(zoone)
            retval = zoone
            promi:resolve(zoone)
            ShowNui('setVisibleMenu', true)
        end)
    elseif data.action == 'coords' then
        promi = promise:new()
        ShowNui('setVisibleMenu', false)
        CopyCoords('single', function(coords)
            if coords then
                ShowNui('setVisibleMenu', true)
                retval = { x = coords.x, y = coords.y, z = coords.z, w = coords.w }
                promi:resolve()
            end
        end)
    elseif data.action == 'spawn_coords' then
        promi = promise:new()
        ShowNui('setVisibleMenu', false)
        CopyCoords('multi', function(coords)
            if coords then
                ShowNui('setVisibleMenu', true)
                retval = coords
                promi:resolve()
            end
        end)
    elseif data.action == 'update' then
        retval = GarageAdmAction('update', data.data)
    elseif data.action == 'delete' then
        retval = GarageAdmAction('delete', data.data)
    elseif data.action == 'teleport' then
        retval = true
        SetEntityCoords(PlayerPedId(), data.data.actioncoords.x, data.data.actioncoords.y, data.data.actioncoords.z)
    end
    if promi then
        Citizen.Await(promi)
    end

    cb(retval)
end)

lib.callback.register('mGarage:OpenAdmins', function()
    SendZones()
    ShowNui('setVisibleMenu', true)
end)

AddEventHandler('onResourceStart', function(name)
    if name == GetCurrentResourceName() then
        lib.hideTextUI()
    end
end)
