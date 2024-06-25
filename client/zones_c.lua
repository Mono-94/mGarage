local Target = exports.ox_target
local ZoneData = {}
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
    SetBlipSprite(entity, data.blipsprite or Config.BlipDefault.sprite)
    SetBlipDisplay(entity, 4)
    SetBlipScale(entity, Config.BlipDefault.size)
    SetBlipColour(entity, data.blipcolor or Config.BlipDefault.color)
    SetBlipAsShortRange(entity, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(data.name)
    EndTextCommandSetBlipName(entity)
    return entity
end

local SetNPC = function(data)
    lib.requestModel(data.npchash, 5000)
    local entity = CreatePed(2, data.npchash, data.actioncoords.x, data.actioncoords.y, data.actioncoords.z, false, false)
    SetEntityHeading(entity, data.actioncoords.w)
    if Config.PedAnims.anims then
        local RandomAnim = Config.PedAnims.list[math.random(1, #Config.PedAnims.list)]
        TaskStartScenarioInPlace(entity, RandomAnim, 0, true)
    end
    SetBlockingOfNonTemporaryEvents(entity, true)
    SetEntityInvincible(entity, true)
    FreezeEntityPosition(entity, true)
    return entity
end

local DeleteZone = function(id)
    if ZoneData[id].zoneType == 'target' then
        Target:removeZone(ZoneData[id].TargetId)
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
            if not v.private then
                local eng = json.decode(v.garage)
                eng.name  = v.name
                eng.id    = v.id
                CreateGarage(eng)
            end
        end
    end
end, 'getZones')

function CreateGarage(data)
    if not ZoneData[data.id] then ZoneData[data.id] = data end

    if type(data.points) ~= 'table' then
        data.points = json.decode(data.points)
    end

    if not data.points or #data.points == 1 then
        return lib.print.error(('Garage [ ID %s - NAME %s ] - data points malformed | Set new Zoona'):format(data.id,
            data.name))
    end

    if not data.actioncoords then
        return lib.print.error(('Garage [ ID %s - NAME %s ] - no Action Coords | Set new Coords'):format(data.id,
            data.name))
    end

    if data.blip then
        ZoneData[data.id].blipEntity = SetBlip(data)
    end

    PolyZone[data.id] = lib.zones.poly({
        name = data.name .. '-garage',
        points = data.points,
        debugColour = vec4(51, 54, 92, 50.0),
        thickness = data.thickness,
        debug = data.debug,
        inside = function()
            if data.zoneType == 'textui' and (not data.job or GetJob().name == data.job) then
                if IsControlJustReleased(0, 38) then
                    data.entity = cache.vehicle
                    if GetPedInVehicleSeat(data.entity, -1) == cache.ped then
                        SaveCar(data)
                    else
                        OpenGarage(data)
                    end
                end
            end
        end,
        onEnter = function()
            if data.job == '' then
                data.job = false
            end

            if data.zoneType == 'target' then
                if not data.npchash or data.npchash == '' then
                    data.npchash = 'csb_trafficwarden'
                end

                ZoneData[data.id].npcEntity = SetNPC(data)

                ZoneData[data.id].TargetId = Target:addLocalEntity(ZoneData[data.id].npcEntity, {
                    {
                        debug = true,
                        drawSprite = true,
                        groups = data.job,
                        label = data.name,
                        icon = "fa-solid fa-warehouse",
                        distance = Config.TargetDistance,
                        onSelect = function()
                            OpenGarage(data)
                        end
                    },
                })
            elseif data.zoneType == 'textui' or Config.Debug then
                local Action = function()
                    TextUI(data.name)
                end
                if data.job then
                    if GetJob().name == data.job then
                        Action()
                    end
                else
                    TextUI(data.name)
                end
            elseif data.zoneType == 'radial' or Config.Debug then
                local Action = function()
                    lib.addRadialItem({
                        {
                            id = 'garage_access',
                            icon = 'warehouse',
                            label = data.name,
                            onSelect = function()
                                OpenGarage(data)
                            end
                        },
                        {
                            id = 'garage_save',
                            icon = 'warehouse',
                            label = locale('TargetSaveCar'),
                            onSelect = function()
                                SaveCar(data)
                            end
                        }
                    })
                end
                if data.job then
                    if GetJob().name == data.job then
                        Action()
                    end
                else
                    Action()
                end
            end

            if data.garagetype ~= 'impound' and data.zoneType == 'target' then
                Target:addGlobalVehicle({
                    {
                        name = 'mGarage:SaveTarget' .. data.name,
                        icon = 'fa-solid fa-road',
                        label = locale('TargetSaveCar'),
                        groups = data.job,
                        distance = 3.0,
                        onSelect = function(vehicle)
                            data.entity = vehicle.entity
                            SaveCar(data)
                        end
                    },
                })
            end
        end,
        onExit = function()
            exports.ox_target:removeGlobalVehicle({ 'mGarage:SaveTarget' .. data.name })
            if ZoneData[data.id].zoneType == 'target' then
                if DoesEntityExist(ZoneData[data.id].npcEntity) then
                    DeleteEntity(ZoneData[data.id].npcEntity)
                    Target:removeLocalEntity(ZoneData[data.id].npcEntity)
                end
            elseif ZoneData[data.id].zoneType == 'textui' then
                HideTextUI()
            elseif ZoneData[data.id].zoneType == 'radial' then
                lib.removeRadialItem('garage_save')
                lib.removeRadialItem('garage_access')
            end
        end
    })
end

if Config.DefaultGarages then
    for k, v in pairs(Config.GaragesDefault) do
        v.id = k + 42094
        v.default = true
        CreateGarage(v)
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
        promi = promise:new()
        CreateZone('mGarage:ExitZone_' .. #ZoneData + 1, function(zoone)
            retval = zoone
            promi:resolve(zoone)
            ShowNui('setVisibleMenu', true)
        end)
    elseif data.action == 'coords' then
        promi = promise:new()
        CopyCoords('single', function(coords)
            if coords then
                ShowNui('setVisibleMenu', true)
                retval = { x = coords.x, y = coords.y, z = coords.z, w = coords.w }
                promi:resolve()
            end
        end, true)
    elseif data.action == 'spawn_coords' then
        promi = promise:new()
        CopyCoords('multi', function(coords)
            if coords then
                ShowNui('setVisibleMenu', true)
                retval = coords
                promi:resolve()
            end
        end, true)
    elseif data.action == 'update' then
        retval = GarageAdmAction('update', data.data)
    elseif data.action == 'delete' then
        retval = GarageAdmAction('delete', data.data, 1500)
    elseif data.action == 'teleport' then
        retval = true
        SetEntityCoords(PlayerPedId(), data.data.actioncoords.x + 1.0, data.data.actioncoords.y, data.data.actioncoords
            .z)
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
