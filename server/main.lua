Core = require 'framework'

local query = {
    ['esx'] = {
        storeVehicle =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ?  WHERE TRIM(`plate`) = TRIM(?) ',
        impoundVehicle =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `metadata` = ? WHERE TRIM(`plate`) = TRIM(?)',
        storeAllVehicles =
        'UPDATE owned_vehicles SET stored = 1 WHERE stored = 0 AND (pound IS NULL OR pound = 0) AND (JSON_EXTRACT(metadata, "$.private") IS NULL OR JSON_EXTRACT(metadata, "$.private") = false)',
        selectMetadata = 'SELECT `metadata` FROM `owned_vehicles` WHERE TRIM(`plate`) = TRIM(?) LIMIT 1'
    },

    ['qbx'] = {
        storeVehicle =
        'UPDATE `player_vehicles` SET `garage` = ?, `stored` = 1, `mods` = ?, type = ?  WHERE TRIM(`plate`) = TRIM(?) ',
        impoundVehicle =
        'UPDATE `player_vehicles` SET `garage` = ?, `stored` = 0, `pound` = 1, `metadata` = ? WHERE TRIM(`plate`) = TRIM(?)',
        storeAllVehicles =
        'UPDATE player_vehicles SET stored = 1 WHERE stored = 0 AND (pound IS NULL OR pound = 0) AND (JSON_EXTRACT(metadata, "$.private") IS NULL OR JSON_EXTRACT(metadata, "$.private") = false)',
        selectMetadata = 'SELECT `metadata` FROM `player_vehicles` WHERE TRIM(`plate`) = TRIM(?) LIMIT 1'
    },
}

local Querys = query[Core.FrameWork]


local VehicleTypes = {
    ['car'] = { 'automobile', 'bicycle', 'bike', 'quadbike', 'trailer', 'amphibious_quadbike', 'amphibious_automobile' },
    ['boat'] = { 'submarine', 'submarinecar', 'boat' },
    ['air'] = { 'blimp', 'heli', 'plane' },
}

local function compare(tbl1, tbl2)
    for _, str1 in ipairs(tbl1) do
        for _, str2 in ipairs(tbl2) do
            if str1 == str2 then
                return true
            end
        end
    end
    return false
end

local function checkType(garageType, vehicleType)
    return type(garageType) == 'table' and lib.table.contains(garageType, vehicleType) or
        garageType == vehicleType or VehicleTypes[vehicleType] and compare(garageType, VehicleTypes[vehicleType])
end


lib.callback.register('mGarage:Interact', function(source, action, data, vehicle)
    local retval = nil
    local Player = Core:Player(source)

    local identifier = Player.identifier

    if action == 'get' then
        local vehicles = {}
        local PlyVehicles = Vehicles.GetAllPlayerVehicles(source, false, true)

        if PlyVehicles then
            lib.array.forEach(PlyVehicles, function(row)
                local vehType = checkType(data.carType, row.type)
                if not vehType then return end

                row.isOwner = row.owner == identifier
                local shared = data.isShared or data.name == row.parking

                if data.garagetype == 'garage' and data.showPound then
                    if row.pound or row.pound == 1 or shared then
                        table.insert(vehicles, row)
                    end
                elseif data.garagetype == 'garage' and shared and not data.showPound then
                    if not row.pound or row.pound == 0 then
                        table.insert(vehicles, row)
                    end
                elseif data.garagetype == 'impound' and shared then
                    if row.pound then
                        table.insert(vehicles, row)
                    end
                end
            end)
        end

        retval = vehicles
    elseif action == 'spawn' then
        local coords = SpawnClearArea({ coords = data.garage.spawnpos, distance = 2.0, player = source })

        if not coords then
            Player.Notify({ title = data.name, description = locale('noSpawnPos'), type = 'error' })
            return false
        end

        Vehicles.CreateVehicleId(
            { id = data.vehicleid, coords = coords, source = source, intocar = data.garage.intocar },
            function(vehicleData, Vehicle)
                if vehicleData and Vehicle then
                    if Vehicles.Config.ItemKeys then
                        Vehicles.ItemCarKeys(source, 'add', vehicleData.metadata.fakeplate or vehicleData.plate)
                    end
                    Vehicle.RetryVehicle()
                    retval = true
                else
                    retval = false
                end
            end)
    elseif action == 'saveCar' then
        local entity = NetworkGetEntityFromNetworkId(data.entity)
        local Vehicle = Vehicles.GetVehicle(entity)
        local VehicleType = GetVehicleType(entity)

        if type(data.carType) == 'table' then
            if not lib.table.contains(data.carType, VehicleType) then
                return false
            end
        elseif not data.carType == VehicleType then
            return false
        end

        if Vehicle then
            local metadata = Vehicle.GetMetadata()
            local job = Player.GetJob()

            if data.job and (not data.job == Vehicle.job) then
                return false
            end

            if data.garagetype == 'custom' and metadata.customGarage and data.name == metadata.customGarage then
                if data.job and not job.name == Vehicle.job or not data.job == Vehicle.job then
                    return false
                end
                if metadata and metadata.customGarage and data.name == metadata.customGarage then
                    if Vehicles.Config.ItemKeys then
                        Vehicles.ItemCarKeys(source, 'delete', Vehicle.plate)
                    end
                    local left = LeftCar(entity, data.seats)

                    if left then
                        Citizen.Wait(2000)
                    end

                    return Vehicle.DeleteVehicle(false)
                end
            elseif data.garagetype == 'custom' and not metadata.customGarage then
                return false
            end


            if Vehicle.owner == identifier or Vehicle.metadata.keys and Vehicle.metadata.keys[identifier] then
                local left = LeftCar(entity, data.seats)

                if left then Citizen.Wait(1000) end

                if Vehicles.Config.ItemKeys then
                    Vehicles.ItemCarKeys(source, 'delete', metadata.fakeplate or Vehicle.plate)
                end

                Vehicle.StoreVehicle(data.name, data.props)

                return true
            else
                Player.Notify({
                    title = data.name,
                    description = locale('notYourVehicle'),
                    type = 'error',
                })
                return false
            end
        else
            data.plate = GetVehicleNumberPlateText(entity)

            local row = Vehicles.GetVehicleByPlate(data.plate, true)

            if not row then
                Player.Notify({
                    title = data.name,
                    description = locale('notYourVehicle'),
                    type = 'error',
                })
                return false
            end

            if data.job then
                if not (data.job == row.job) then
                    return false
                end
            end

            local metdata = json.decode(row.metadata)

            if row and row.owner == identifier or metdata.keys and metdata.keys[identifier] then
                MySQL.update(Querys.storeVehicle, { data.name, data.props, VehicleType, data.plate },
                    function(affectedRows)
                        if affectedRows then
                            if Vehicles.Config.ItemKeys then
                                Vehicles.ItemCarKeys(source, 'delete', data.plate)
                            end
                            DeleteEntity(entity)
                        end
                    end)
            else
                Player.Notify({
                    title = data.name,
                    description = locale('notYourVehicle'),
                    type = 'error',
                })
            end
        end
    elseif action == 'setimpound' then
        local composed = nil

        if data.hourEndPound and data.dateEndPound then
            local timestamphour = math.floor(data.hourEndPound / 1000)
            local hour = os.date('%H:%M', timestamphour)
            local timestamp = math.floor(data.dateEndPound / 1000)
            local date = os.date('%Y/%m/%d', timestamp)
            composed = ('%s %s'):format(date, hour)
        end
        local infoimpound = {
            reason = data.reason,
            price = data.price,
            impoundDate = os.date("%Y/%m/%d %H:%M:%S", os.time()),
            endPound = composed
        }

        local entity = NetworkGetEntityFromNetworkId(data.entity)
        local Vehicle = Vehicles.GetVehicle(entity)
        if Vehicle then
            Vehicle.ImpoundVehicle(data.garage, infoimpound.price, infoimpound.reason, infoimpound.impoundDate,
                infoimpound.endPound)
        else
            local plate = GetVehicleNumberPlateText(entity)
            local row = Vehicles.GetVehicleByPlate(plate, true)

            if row then
                local metadata = row.metadata
                if not metadata then
                    metadata = {}
                else
                    metadata = json.decode(metadata)
                end

                metadata.pound = infoimpound

                MySQL.update(Querys.impoundVehicle, { data.garage, json.encode(metadata), plate })

                DeleteEntity(entity)
            else
                DeleteEntity(entity)
            end
        end
    elseif action == 'impound' then
        local ImpVeh = Vehicles.GetVehicleByID(data.vehicleid)
        if ImpVeh then
            local metadata = json.decode(ImpVeh.metadata)
            local infoimpound = metadata.pound
            local PlayerMoney = Player.getMoney(data.paymentMethod)
            if infoimpound.endPound then
                local year, month, day, hour, min = infoimpound.endPound:match("(%d+)/(%d+)/(%d+) (%d+):(%d+)")

                if year and month and day and hour and min then
                    local endPoundDate = os.time({
                        year = year,
                        month = month,
                        day = day,
                        hour = hour,
                        min = min
                    })

                    local currentDate = os.time()
                    if currentDate < endPoundDate then
                        local timeDifference = endPoundDate - currentDate
                        local days = math.floor(timeDifference / (24 * 60 * 60))
                        local hours = math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60))
                        local minutes = math.floor((timeDifference % (60 * 60)) / 60)

                        Player.Notify({
                            title = data.garage.name,
                            description = locale('ImpoundOption13', days, hours, minutes),
                            type = 'error',
                        })

                        return false
                    end
                end
            end


            if PlayerMoney.money >= infoimpound.price then
                ImpVeh.coords = SpawnClearArea({ coords = data.garage.spawnpos, distance = 2.0, player = source })

                if ImpVeh.coords and type(ImpVeh) == 'table' then
                    Player.RemoveMoney(data.paymentMethod, infoimpound.price)
                    ImpVeh.intocar = data.garage.intocar
                    ImpVeh.source = source
                    Vehicles.CreateVehicle(ImpVeh, function(VehData, Vehicle)
                        if Vehicles.Config.ItemKeys then
                            Vehicles.ItemCarKeys(source, 'add', VehData.metadata.fakeplate or VehData.plate)
                        end

                        Vehicle.RetryImpound(data.garage.defaultGarage)
                    end)


                    if data.garage.society then
                        Core:SetSotcietyMoney(data.garage.society, infoimpound.price)
                    end

                    Player.Notify({
                        title = data.garage.name,
                        description = locale('impound1', infoimpound.price),
                        type = 'success',
                    })
                    retval = true
                else
                    Player.Notify({
                        title = data.garage.name,
                        description = locale('noSpawnPos'),
                        type = 'warning',
                    })
                    retval = false
                end
            else
                Player.Notify({
                    title = data.garage.name,
                    description = locale('impound2'),
                    type = 'warning',
                })
                retval = false
            end
        end
    elseif action == 'changeimpound' then
        local ImpVeh = Vehicles.GetVehicleByPlate(data, true)
        if ImpVeh then
            local metadata = json.decode(ImpVeh.metadata)
            if metadata.pound then
                if metadata.pound.endPound then
                    metadata.pound.endPound = nil
                    Vehicles.UpdateMetadataPlate(data, metadata)
                    retval = true
                    Player.Notify({ title = 'Garage Unpound', description = locale('ImpoundOption11'), type = 'success', })
                else
                    Player.Notify({ title = 'Garage Unpound', description = locale('ImpoundOption8'), type = 'error' })
                    retval = false
                end
            else
                Player.Notify({ title = 'Garage Unpound', description = locale('ImpoundOption9'), type = 'error' })
                retval = false
            end
        else
            Player.Notify({
                title = 'Garage Unpound',
                description = locale('ImpoundOption10', data),
                type = 'error',
            })
            retval = false
        end
    elseif action == 'spawncustom' then
        local coords = SpawnClearArea({ coords = data.garage.spawnpos, distance = 2.0, player = source })

        if not coords then
            Player.Notify({ title = data.name, description = locale('noSpawnPos'), type = 'error' })
            return false
        end

        local plate = Vehicles.GeneratePlate()
        local platePrefix = data.garage.platePrefix


        if platePrefix and #platePrefix > 0 then
            if #platePrefix < 4 then
                platePrefix = string.format("%-4s", platePrefix)
            end
            plate = platePrefix:upper() .. string.sub(plate, 5)
        end

        Vehicles.CreateVehicle({
            vehicle  = { model = data.vehicle.model, fuelLevel = 100 },
            plate    = plate,
            job      = (data.garage.job == false) and nil or data.garage.job,
            source   = source,
            intocar  = data.garage.intocar,
            owner    = identifier,
            coords   = coords,
            metadata = { customGarage = data.garage.name, keys = { [identifier] = identifier }, },
        }, function(VehicleData, Vehicle)
            if Vehicles.Config.ItemKeys then
                Vehicles.ItemCarKeys(source, 'add', VehicleData.plate)
            end
        end)

        return true
    elseif action == 'spawnrent' then
        local coords = SpawnClearArea({ coords = data.garage.spawnpos, distance = 2.0, player = source })

        if not coords then
            Player.Notify({ title = data.name, description = locale('noSpawnPos'), type = 'error' })
            return false
        end

        local PlayerMoney = Player.getMoney(data.paymentMethod)

        if PlayerMoney.money >= tonumber(data.totalPrice) then
            local plate = Vehicles.GeneratePlate()


            if data.garage.platePrefix and #data.garage.platePrefix > 0 then
                if #data.garage.platePrefix < 4 then
                    data.garage.platePrefix = string.format("%-4s", data.garage.platePrefix)
                end
                plate = data.garage.platePrefix:upper() .. string.sub(plate, 5)
            end

            Player.RemoveMoney(data.paymentMethod, tonumber(data.totalPrice))

            Vehicles.CreateVehicle({
                vehicle   = { model = data.vehicle.model, fuelLevel = 100 },
                job       = (data.garage.job == false) and nil or data.garage.job,
                plate     = plate,
                source    = source,
                intocar   = data.garage.intocar,
                owner     = identifier,
                coords    = coords,
                setOwner  = true,
                metadata  = { rent = true, rentName = data.garage.name },
                temporary = data.rentDate
            }, function(VehicleData, Vehicle)
                if Vehicles.Config.ItemKeys then
                    Vehicles.ItemCarKeys(source, 'add', VehicleData.plate)
                end
            end)
            retval = true
        else
            retval = false
        end
    elseif action == 'changeName' then
        local Vehicle = Vehicles.GetVehicleByPlate(data.vehicle.plate)

        if Vehicle then
            Vehicle.setName(data.newName)
            retval = true
        else
            local row = MySQL.single.await(Querys.selectMetadata, { data.vehicle.plate })

            if row then
                local metadata = json.decode(row.metadata)
                if not metadata then
                    metadata = {}
                end
                if metadata then
                    metadata.vehname = data.newName
                    Vehicles.UpdateMetadataPlate(data.vehicle.plate, metadata)
                    retval = true
                else
                    retval = false
                end
            else
                retval = false
            end
        end
    elseif action == 'cleanName' then
        local Vehicle = Vehicles.GetVehicleByPlate(data.vehicle.plate)

        if Vehicle then
            vehicle.DeleteMetadata('vehname')
            retval = true
        else
            local row = Vehicles.GetVehicleByPlate(data.vehicle.plate, true)

            if row then
                local metadata = json.decode(row.metadata)

                if metadata then
                    metadata.vehname = nil
                    Vehicles.UpdateMetadataPlate(data.vehicle.plate, metadata)
                    retval = true
                else
                    retval = false
                end
            else
                retval = false
            end
        end
    elseif action == 'setFav' then
        local VehicleEntity = Vehicles.GetVehicleByPlate(data.plate)

        if VehicleEntity then
            local currentFav = VehicleEntity.GetMetadata('fav') or false
            local newFav = not currentFav

            VehicleEntity.SetMetadata('fav', newFav)
            retval = { fav = newFav }
        else
            local Vehicle = Vehicles.GetVehicleByPlate(data.plate, true)
            if Vehicle then
                local metadata = json.decode(Vehicle.metadata)

                local currentFav = metadata.fav or false
                metadata.fav = not currentFav

                retval = { fav = metadata.fav }
                Vehicles.UpdateMetadataPlate(data.plate, metadata)
            end
        end
    end

    return retval
end)


AddEventHandler("onResourceStart", function(Resource)
    if Resource == 'mGarage' then
        if not Vehicles.Config.Persistent then
            MySQL.update(Querys.storeAllVehicles)
        end
    end
end)

if Config.ImpoundVehicledelete then
    local function HandleDeleteEvent(entity)
        local entityType = GetEntityType(entity)
        if entityType == 2 then
            if Vehicles.save() then return end
            local type = GetVehicleType(entity)

            local plate = GetVehicleNumberPlateText(entity)
            local vehicle = Vehicles.GetVehicleByPlate(plate, true)


            if vehicle and vehicle.stored == 0 and not vehicle.pound then
                local impound = GetDefaultImpound(type)

                vehicle.metadata = json.decode(vehicle.metadata)

                if vehicle.metadata.RoutingBucket then return end

                vehicle.metadata.pound = {
                    price = Config.DefaultImpound.price,
                    reason = Config.DefaultImpound.note,
                    date = os.date("%Y/%m/%d %H:%M"),
                }

                MySQL.update(Querys.impoundVehicle, { impound, json.encode(vehicle.metadata), plate })

                Vehicles.DeleteFromTable(entity)
            end
        end
    end
    -- Vehicle deleted? send to impound
    AddEventHandler('entityRemoved', HandleDeleteEvent)
end


function LeftCar(entity, seats)
    local players = 0
    local playerLeft = false
    local startTime = GetGameTimer()

    repeat
        for i = -1, seats do
            local ped = GetPedInVehicleSeat(entity, i)

            if ped and DoesEntityExist(ped) then
                TaskLeaveVehicle(ped, entity, 0)
                players = players + 1
                playerLeft = true
            end
        end

        Citizen.Wait(100)

        if GetGameTimer() - startTime > 10000 then
            break
        end
    until players >= seats or players == 0

    return playerLeft
end

function SpawnClearArea(data)
    local player = GetPlayerPed(data.player)
    local playerpos = GetEntityCoords(player)
    local selectedCoords = nil

    if #data.coords == 1 then
        local v = data.coords[1]
        return vec4(v.x, v.y, v.z, v.w)
    end

    for attempt = 1, #data.coords do
        for _, v in ipairs(data.coords) do
            local spawnPos = vector3(v.x, v.y, v.z)
            local distanceToPlayer = #(playerpos - spawnPos)

            if distanceToPlayer < (selectedCoords and #(playerpos - vector3(selectedCoords.x, selectedCoords.y, selectedCoords.z)) or math.huge) then
                local clearOfVehicles = true
                for _, vehicle in pairs(GetAllVehicles()) do
                    if #(spawnPos - GetEntityCoords(vehicle)) <= data.distance then
                        clearOfVehicles = false
                        break
                    end
                end

                if clearOfVehicles and distanceToPlayer > data.distance then
                    selectedCoords = vec4(v.x, v.y, v.z, v.w)
                end
            end
        end

        if selectedCoords then break end
    end

    return selectedCoords or false
end

function GetDefaultImpound(type)
    for vehicleType, types in pairs(VehicleTypes) do
        for _, v in ipairs(types) do
            if v == type or type == vehicleType then
                return Config.DefaultImpound[vehicleType]
            end
        end
    end
end

lib.versionCheck('Mono-94/mGarage')
