local Target = exports.ox_target
local ZoneData = {}
local PolyZone = {}
local DefaultGarages = require 'DefaultGarages'



local SendZones = function(show)
    local filteredData = {}
    for _, v in pairs(ZoneData) do
        if v ~= nil then
            table.insert(filteredData, v)
        end
    end

    SendNUI("GarageZones", filteredData)

    if show then ShowNui('setVisibleMenu', true) end
end


local DeleteZone = function(id)
    if ZoneData[id].zoneType == 'target' then
        Target:removeLocalEntity(ZoneData[id].targetEntity)
    end

    if DoesEntityExist(ZoneData[id].targetEntity) then
        DeleteEntity(ZoneData[id].targetEntity)
    end

    if DoesBlipExist(ZoneData[id].blipEntity) then
        RemoveBlip(ZoneData[id].blipEntity)
    end

    Target:removeGlobalVehicle({ 'mGarage:SaveTarget' .. ZoneData[id].name })


    if PolyZone[id] then PolyZone[id]:remove() end

    ZoneData[id] = nil

    SendZones()

    if not ZoneData[id] then
        return true
    else
        return false
    end
end

function CreateGarage(data)
    if type(data.points) ~= 'table' then
        data.points = json.decode(data.points)
    end

    if not data.points or #data.points == 1 or not next(data.points) then
        lib.print.error(('Garage [ ID %s - NAME %s ] - data points malformed | Set new Zoona'):format(data.id, data.name))
        return
    end

    if not data.actioncoords or not next(data.actioncoords) then
        lib.print.error(('Garage [ ID %s - NAME %s ] - no Action Coords | Set new Coords'):format(data.id, data.name))
        return
    end

    if data.blip then
        data.blipEntity = SetBlip(data)
    end

    if data.job and type(data.job) == 'string' and data.job == '' then
        data.job = false
    end

    local id = data.id or data.name


    PolyZone[id] = lib.zones.poly({
        name = data.name .. '-garage',
        points = data.points,
        debugColour = vec4(255.0, 255.0, 255.0, 50.0),
        thickness = data.thickness,
        debug = data.debug,
        inside = function()
            if data.zoneType == 'textui' and (not data.job or Core:GetPlayerJob().name == data.job) then
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
            if data.zoneType == 'target' then
                if data.prop then
                    data.targetEntity = SetProp(data)
                elseif not data.prop then
                    if not data.npchash or data.npchash == '' then
                        data.npchash = 'csb_trafficwarden'
                    end
                    data.targetEntity = SetNPC(data)
                end

                data.TargetId = Target:addLocalEntity(data.targetEntity, {
                    {
                        groups = data.job,
                        label = data.name,
                        icon = "fa-solid fa-warehouse",
                        distance = Config.TargetDistance,
                        onSelect = function()
                            OpenGarage(data)
                        end
                    },
                })
            elseif data.zoneType == 'textui' then
                if not data.job or Core:GetPlayerJob().name == data.job then
                    Config.Textui.Showtext(data.name)
                end
            elseif data.zoneType == 'radial' then
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
                if not data.job or Core:GetPlayerJob().name == data.job then
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
                        distance = Config.TargetDistance,
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

            if data.zoneType == 'target' then
                if DoesEntityExist(data.targetEntity) then
                    DeleteEntity(data.targetEntity)
                    Target:removeLocalEntity(data.targetEntity)
                end
            elseif data.zoneType == 'textui' then
                Config.Textui.HideText()
            elseif data.zoneType == 'radial' then
                lib.removeRadialItem('garage_save')
                lib.removeRadialItem('garage_access')
            end
        end
    })

    ZoneData[id] = data

    if not data.default then
        SendZones()
    end
end

RegisterSafeEvent('mGarage:Zone', function(action, data)
    if action == 'add' then
        CreateGarage(data)
    elseif action == 'delete' then
        DeleteZone(data)
    elseif action == 'update' then
        local check = DeleteZone(data.id)
        if check then
            CreateGarage(data)
        end
    end
end)

if Config.DefaultGarages and DefaultGarages then
    lib.array.forEach(DefaultGarages, function(garage)
        garage.default = true
        CreateGarage(garage)
    end)
end

lib.callback('mGarage:GarageZones', false, function(response)
    if response then
        lib.array.forEach(response, function(garage)
            if not garage.private then
                local eng = json.decode(garage.garage)
                eng.name  = garage.name
                eng.id    = garage.id
                if eng.job == '' then
                    eng.job = false
                end
                CreateGarage(eng)
            end
        end)
    end
end, 'getZones')


-- Manage Zones
local ZonesCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:GarageZones', delay or false, action, data)
end

local usePromise = nil
---@param cb function
RegisterNuiCallback('mGarage:adm', function(data, cb)
    local retval
    usePromise = nil
    if data.action == 'create' then
        retval = ZonesCallBack('create', data.data)
    elseif data.action == 'zone' then
        ToggleMenu(true, 'zone')

        usePromise = promise:new()

        CreateZone('mGarage:ExitZone_' .. #ZoneData + 1, false, function(zoone)
            retval = zoone
            usePromise:resolve(zoone)
            ToggleMenu(false)
        end)
    elseif data.action == 'coords' then
        ToggleMenu(true, 'coords')

        usePromise = promise:new()

        CopyCoords('single', 'ped', false, function(coords)
            if coords then
                ToggleMenu(false)
                retval = coords
                usePromise:resolve()
            end
        end)
    elseif data.action == 'spawn_coords' then
        ToggleMenu(true, 'coords')

        usePromise = promise:new()

        CopyCoords('multi', 'car', false, function(coords)
            if coords then
                ToggleMenu(false)
                retval = coords
                usePromise:resolve()
            end
        end)
    elseif data.action == 'update' then
        retval = ZonesCallBack('update', data.data)
    elseif data.action == 'delete' then
        retval = ZonesCallBack('delete', data.data, 1500)
    elseif data.action == 'teleport' then
        retval = true
        SetEntityCoords(cache.ped, data.data.actioncoords.x + 1.0, data.data.actioncoords.y,
            data.data.actioncoords.z or 0,
            nil, nil, false, false)
    end

    if usePromise then Citizen.Await(usePromise) end

    cb(retval)
end)


RegisterSafeEvent('mGarage:editcreate', function()
    if Core:PlayerGroup() == Config.AdminGroup then SendZones(true) end
end)


AddEventHandler('onResourceStop', function(name)
    if name == GetCurrentResourceName() then
        Config.Textui.HideText()

        for k, v in pairs(ZoneData) do
            if ZoneData[k].targetEntity then
                DeleteEntity(ZoneData[k].targetEntity)
            end
        end
    end
end)


---@param count? boolean
---@return integer|table
function GetGaragesData(count)
    local Garages = { impound = {}, garage = {}, custom = {}, totalGarges = 0 }
    for k, v in pairs(ZoneData) do
        if v ~= nil then
            Garages.totalGarges = Garages.totalGarges + 1
            if v.job then
                v.jobname = ('%s, Job: %s'):format(v.name, v.job)
            end
            table.insert(Garages[v.garagetype], v)
        end
    end
    return count and Garages.totalGarges or Garages
end

exports('GetGaragesData', GetGaragesData)
