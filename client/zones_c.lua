local ZoneData = {}
local PolyZone = {}
local Blips = {}
local DefaultGarages = require 'DefaultGarages'
local ox_target = GetResourceState("ox_target") == "started"
local targetEntity = {}


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
    if ZoneData[id].zoneType == 'target' and ox_target then
        exports.ox_target:removeLocalEntity(targetEntity[id])
    end

    if DoesEntityExist(targetEntity[id]) then
        DeleteEntity(targetEntity[id])
    end

    if DoesBlipExist(Blips[id]) then
        RemoveBlip(Blips[id])
    end
    if ox_target then
        exports.ox_target:removeGlobalVehicle({ ('mGarage:SaveTarget'):format(ZoneData[id].name) })
    end
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

    if data.job and type(data.job) == 'string' and data.job == '' then
        data.job = false
    end

    local id = data.id or data.name

    if data.blip then
        Blips[id] = SetBlip(data)
    end

    local open = function()
        OpenGarage({
            name = data.name,
            garagetype = data.garagetype,
            intocar = data.intocar,
            carType = data.carType,
            spawnpos = data.spawnpos,
            showPound = data.showPound,
            isShared = data.isShared,
            defaultCars = data.defaultCars,
            job = data.job,
            rent = data.rent,
            platePrefix = data.platePrefix,
        })
    end

    local save = function(entity)
        SaveCar({
            name = data.name,
            garagetype = data.garagetype,
            intocar = data.intocar,
            carType = data.carType,
            spawnpos = data.spawnpos,
            showPound = data.showPound,
            isShared = data.isShared,
            defaultCars = data.defaultCars,
            job = data.job,
            rent = data.rent,
            entity = entity,
            platePrefix = data.platePrefix,
        })
    end

    PolyZone[id] = lib.zones.poly({
        name = data.name .. '-garage',
        points = data.points,
        debugColour = vec4(255.0, 255.0, 255.0, 50.0),
        thickness = data.thickness,
        debug = data.debug,
        inside = function()
            if data.zoneType == 'textui' and (not data.job or Core:GetPlayerJob().name == data.job) then
                if IsControlJustReleased(0, 38) then
                    if cache.vehicle and GetPedInVehicleSeat(cache.vehicle, -1) == cache.ped then
                        save(cache.vehicle)
                    else
                        open()
                    end
                end
            end
        end,
        onEnter = function()
            if data.zoneType == 'target' then
                if data.prop then
                    targetEntity[id] = SetProp(data)
                elseif not data.prop then
                    if not data.npchash or data.npchash == '' then
                        data.npchash = 'csb_trafficwarden'
                    end
                    targetEntity[id] = SetNPC(data)
                end
                if ox_target then
                    exports.ox_target:addLocalEntity(targetEntity[id], {
                        {
                            groups = data.job,
                            label = data.name,
                            icon = "fa-solid fa-warehouse",
                            distance = Config.TargetDistance,
                            onSelect = function()
                                open()
                            end
                        },
                    })
                end
            elseif data.zoneType == 'textui' then
                if not data.job or Core:GetPlayerJob().name == data.job then
                    Config.Textui.Showtext(locale('open_garage_textui', data.name), { icon = 'warehouse' })
                end
            elseif data.zoneType == 'radial' then
                if not data.job or Core:GetPlayerJob().name == data.job then
                    lib.addRadialItem({
                        {
                            id = 'garage_access',
                            icon = 'warehouse',
                            label = data.name,
                            onSelect = function()
                                open()
                            end
                        },
                        {
                            id = 'garage_save',
                            icon = 'warehouse',
                            label = locale('TargetSaveCar'),
                            onSelect = function()
                                if cache.vehicle and GetPedInVehicleSeat(cache.ped, -1) == cache.ped then
                                    save(cache.entity)
                                end
                            end
                        }
                    })
                end
            end

            if data.garagetype ~= 'impound' and data.zoneType == 'target' and not data.rent then
                if ox_target then
                    exports.ox_target:addGlobalVehicle({
                        {
                            name = ('mGarage:SaveTarget'):format(data.name),
                            icon = 'fa-solid fa-road',
                            label = locale('TargetSaveCar'),
                            groups = data.job,
                            distance = Config.TargetDistance,
                            onSelect = function(vehicle)
                                save(vehicle.entity)
                            end
                        },
                    })
                end
            end
        end,
        onExit = function()
            if data.zoneType == 'target' then
                if DoesEntityExist(targetEntity[id]) then
                    DeleteEntity(targetEntity[id])
                    if ox_target then
                        exports.ox_target:removeLocalEntity(targetEntity[id])
                    end
                end
                if ox_target then
                    exports.ox_target:removeGlobalVehicle({ ('mGarage:SaveTarget'):format(data.name) })
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
    Citizen.CreateThread(function()
        lib.array.forEach(DefaultGarages, function(garage)
            garage.default = true
            CreateGarage(garage)
        end)
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
    local retval = nil
    usePromise = nil
    if data.action == 'create' then
        retval = ZonesCallBack('create', data.data)
    elseif data.action == 'zone' then
        ToggleMenu(true, 'zone')
        usePromise = promise:new()
        CreateZone('mGarage:ExitZone_' .. #ZoneData + 1, false, function(zone)
            retval = zone
            usePromise:resolve(zone)
            ToggleMenu(false)
        end)
    elseif data.action == 'coords' then
        ToggleMenu(true, 'singlecoords')
        usePromise = promise:new()
        CopyCoords('single', 'ped', function(coords)
            ToggleMenu(false)
            retval = coords
            usePromise:resolve(coords)
        end)
    elseif data.action == 'spawn_coords' then
        ToggleMenu(true, 'multicoords')
        usePromise = promise:new()
        CopyCoords('multi', 'car', function(coords)
            ToggleMenu(false)
            retval = coords
            usePromise:resolve(coords)
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


RegisterNuiCallback('mGarage:ValidModel', function(model, cb)
    local valid = {}
    if model then
        valid.valid = IsModelValid(model)
        if not valid.valid then
            Config.Notify({
                title = 'mGarage',
                icon = 'car',
                description = ('Invalid model: %s'):format(model),
                type = 'error',
            })
        else
            valid.vehlabel = Vehicles.GetVehicleLabel(model)
        end

        cb(valid)
    end
end)

RegisterSafeEvent('mGarage:editcreate', SendZones)


AddEventHandler('onResourceStop', function(name)
    if name == GetCurrentResourceName() then
        Config.Textui.HideText()

        for k, v in pairs(ZoneData) do
            if targetEntity[k] then
                DeleteEntity(targetEntity[k])
            end
        end
    end
end)


---@param count? boolean
---@return integer|table
function GetGaragesData(count)
    local garagesdata <const> = ZoneData
    local Garages = { impound = {}, garage = {}, custom = {}, all = {}, totalGarges = 0, }
    for k, v in pairs(garagesdata) do
        if v ~= nil then
            Garages.totalGarges = Garages.totalGarges + 1
            if v.job then
                v.jobname = ('%s, Job: %s'):format(v.name, v.job)
            end
            table.insert(Garages[v.garagetype], v)
            Garages.all[v.name] = v
        end
    end
    return count and Garages.totalGarges or Garages
end

exports('GetGaragesData', GetGaragesData)
