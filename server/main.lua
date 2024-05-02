local SpawnClearArea = function(data)
    local player = GetPlayerPed(data.player)
    local playerpos = GetEntityCoords(player)
    local distancia, coords = math.huge, nil

    for _, v in ipairs(data.coords) do
        local spawnPos = vector3(v.x, v.y, v.z)
        local distance = #(playerpos - spawnPos)

        if distance < distancia then
            local isClear = true
            for k, vehicle in pairs(GetAllVehicles()) do
                local vehicleDistance = #(vector3(spawnPos.x, spawnPos.y, spawnPos.z) - GetEntityCoords(vehicle))
                if vehicleDistance <= data.distance then
                    isClear = false
                    break
                end
            end

            if isClear then
                distancia, coords = distance, vec4(v.x, v.y, v.z, v.w)
            end
        end
    end

    return coords, distancia
end


local queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1'
local queryStore2 = 'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? '

lib.callback.register('mGarage:Interact', function(source, action, data, vehicle)
    local retval = nil
    local Player = ESX.GetPlayerFromId(source)

    if action == 'get' then
        local vehicles = {}

        local PlyVehicles = Vehicles.GetAllVehicles(source, false, true)

        if PlyVehicles then
            for i = 1, #PlyVehicles do
                local row = PlyVehicles[i]
                row.isOwner = row.owner == Player.identifier
                if data.garagetype == 'garage' and not row.pound or row.pound == 0 then
                    if data.isShared then
                        table.insert(vehicles, row)
                    else
                        if data.name == row.parking then
                            if type(data.carType) == 'table' then
                                if lib.table.contains(data.carType, row.type) then
                                    table.insert(vehicles, row)
                                end
                            elseif data.carType == row.type then
                                table.insert(vehicles, row)
                            end
                        end
                    end
                elseif data.garagetype == 'impound' then
                    if data.isShared then
                        table.insert(vehicles, row)
                    else
                        if data.name == row.parking then
                            if type(data.carType) == 'table' then
                                if lib.table.contains(data.carType, row.type) then
                                    table.insert(vehicles, row)
                                end
                            elseif data.carType == row.type then
                                table.insert(vehicles, row)
                            end
                        end
                    end
                end
            end
        end
        retval = vehicles
    elseif action == 'spawn' then
        local vehicle = Vehicles.GetVehicleId(data.vehicleid)

        if vehicle then
            vehicle.coords = SpawnClearArea({
                coords = data.garage.spawnpos,
                distance = 2.0,
                player = source
            })
            vehicle.vehicle = json.decode(vehicle.vehicle)
            if data.garage.intocar then
                vehicle.intocar = source
            end
            local data, action = Vehicles.CreateVehicle(vehicle)
            action.RetryVehicle(vehicle.coords)
            if Config.CarkeysItem then
                Vehicles.ItemCarKeys(source, 'add', vehicle.plate)
            end
            retval = true
        end
    elseif action == 'saveCar' then
        local entity = NetworkGetEntityFromNetworkId(data.entity)
        local Vehicle = Vehicles.GetVehicle(entity)
        local VehicleType = GetVehicleType(entity)

        if type(data.carType) == 'table' then
            if not lib.table.contains(data.carType, VehicleType) then
                return false
            end
        elseif data.carType == VehicleType then
            return false
        end


        if Vehicle then
            if type(Vehicle.keys) == 'string' then
                Vehicle.keys = json.decode(Vehicle.keys)
            end

            if data.job then
                if not (data.job == Vehicle.job) then
                    return false
                end
            end

            if Vehicle.owner == Player.identifier or Vehicle.keys[Player.identifier] then
                if Config.CarkeysItem then
                    Vehicles.ItemCarKeys(source, 'delete', Vehicle.plate)
                end
                return Vehicle.StoreVehicle(data.name, data.props)
            else
                TriggerClientEvent('mGarage:notify', source, {
                    title = data.name,
                    description = Text[Config.Lang].notYourVehicle,
                    type = 'error',
                })
            end
        else
            local row = MySQL.single.await(queryStore1, { data.plate })

            if not row then return false end
            if data.job then
                if not (data.job == row.job) then
                    return false
                end
            end

            if row and row.owner == Player.identifier or row.keys and row.keys[Player.identifier] then
                MySQL.update(queryStore2, { data.name, json.encode(data.props), VehicleType, data.plate },
                    function(affectedRows)
                        if affectedRows then
                            DeleteEntity(entity)
                            if Config.CarkeysItem then
                                Vehicles.ItemCarKeys(source, 'remove', data.plate)
                            end
                        end
                    end)
            else
                TriggerClientEvent('mGarage:notify', source, {
                    title = data.name,
                    description = Text[Config.Lang].notYourVehicle,
                    type = 'error',
                })
            end
        end
    elseif action == 'setimpound' then
        local infoimpound = {
            reason = data.reason,
            price = data.price,
            date = os.date("%Y-%m-%d %H:%M:%S", os.time()),
        }
        local entity = NetworkGetEntityFromNetworkId(data.entity)
        local Vehicle = Vehicles.GetVehicle(entity)
        if Vehicle then
            Vehicle.ImpoundVehicle(data.garage, infoimpound.price, infoimpound.reason, infoimpound.time)
        else
            DeleteEntity(entity)
        end
    elseif action == 'impound' then
        local Player = ESX.GetPlayerFromId(source)

        local vehicle = Vehicles.GetVehicleId(data.vehicleid)
        if vehicle then
            local metadata = json.decode(vehicle.metadata)
            local infoimpound = metadata.pound
            local PlayerMoney = Player.getAccount(data.paymentMethod)
            if PlayerMoney.money >= infoimpound.price then
               
                vehicle.coords = SpawnClearArea({  coords = data.garage.spawnpos, distance = 2.0, player = source })
                if vehicle.coords then
                    Player.removeAccountMoney(data.paymentMethod, infoimpound.price)
                    vehicle.vehicle = json.decode(vehicle.vehicle)
                    local entity, action = Vehicles.CreateVehicle(vehicle)
                    action.RetryImpound(data.garage.name, vehicle.coords)

                    if Config.CarkeysItem then
                        Vehicles.ItemCarKeys(source, 'add', vehicle.plate)
                    end

                    if data.garage.society then
                        TriggerEvent('esx_addonaccount:getSharedAccount', data.garage.society, function(account)
                            account.addMoney(infoimpound.price)
                        end)
                    end

                    TriggerClientEvent('mGarage:notify', source, {
                        title = data.garage.name,
                        description = (Text[Config.Lang].impound1):format(infoimpound.price),
                        type = 'success',
                    })
                    retval = true
                else
                    TriggerClientEvent('mGarage:notify', source, {
                        title = data.garage.name,
                        description = Text[Config.Lang].noSpawnPos,
                        type = 'warning',
                    })
                    retval = false
                end
            else
                TriggerClientEvent('mGarage:notify', source, {
                    title = data.garage.name,
                    description =  Text[Config.Lang].impound2,
                    type = 'warning',
                })
                retval = false
            end
        end
    elseif action == 'setBlip' then
        local vehicle = Vehicles.GetVehicleByPlate(data.plate)
        if vehicle then
            retval = GetEntityCoords(vehicle.entity)
        end
    end
    return retval
end)
