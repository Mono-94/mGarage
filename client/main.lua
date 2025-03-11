Core = require 'framework'

local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end

local lastData = {}




function OpenGarage(data)
    lastData = data

    local SendData = {}

    local PlayerJob = Core:GetPlayerJob()

    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        local VehiclesData = ServerCallBack('get', data)

        if not VehiclesData then return false end

        lib.array.forEach(VehiclesData, function(row)
            if not row.private then
                local props = json.decode(row.vehicle)
                row.vehlabel = Vehicles.GetVehicleLabel(props.model)
                row.vehlabel_original = row.vehlabel
                row.metadata = json.decode(row.metadata)
                row.fuelLevel = props.fuelLevel
                if row.metadata then
                    if row.metadata.fakeplate then
                        row.fakeplate = row.metadata.fakeplate
                    end
                    if row.metadata.vehname then
                        row.vehlabel = row.metadata.vehname
                    end
                end

                if props.bodyHealth and props.engineHealth then
                    row.engineHealth = props.bodyHealth / 10
                    row.bodyHealth = props.engineHealth / 10
                else
                    row.engineHealth = 100
                    row.bodyHealth = 100
                end

                row.mileage = row.mileage / 100

                table.insert(SendData, row)
            end
        end)
    elseif data.garagetype == 'custom' then
        for k, v in pairs(data.defaultCars) do
            local isValid = true
            local isModelValid = IsModelValid(v.model)

            if isModelValid then
                -- Transform old grades to new mingrade
                if v.grades and type(v.grades) == 'table' and #v.grades >= 1 and type(data.job) == 'string' then
                    local maxGrade = math.max(table.unpack(v.grades))
                    v.mingrade = maxGrade
                end

                if type(v.mingrade) == 'number' and type(data.job) == 'string' then
                    local grade = PlayerJob.grade >= v.mingrade
                    if not grade then
                        isValid = false
                    end
                else
                    isValid = true
                end
            else
                lib.print.warn(('vehicle model %s is not valid at Garage Name %s'):format(v.model:upper(),
                data.name:upper()))
                isValid = false
            end

            if isValid then
                v.parking = data.name
                if not v.vehlabel then
                    v.vehlabel = Vehicles.GetVehicleLabel(v.model)
                end
                table.insert(SendData, v)
            end
        end
    end

    if #SendData <= 0 or not SendData then
        return Config.Notify({ title = data.name, description = locale('noVehicles') })
    end

    SendNUI('garage', { vehicles = SendData, garage = data })
    ShowNui('setVisibleGarage', true)
end

function SaveCar(save)
    local vehiclePed = GetVehiclePedIsUsing(cache.ped)

    if not DoesEntityExist(save.entity) then
        save.entity = vehiclePed
    end

    if not DoesEntityExist(save.entity) then
        return false
    end

    local IsTrailer, trailerEntity = GetVehicleTrailerVehicle(save.entity)

    if IsTrailer then
        local trailer = save
        trailer.props = json.encode(lib.getVehicleProperties(trailerEntity))
        trailer.vehmodel = GetDisplayNameFromVehicleModel(GetEntityModel(trailerEntity))
        trailer.entity = VehToNet(trailerEntity)
        trailer.seats = GetVehicleMaxNumberOfPassengers(trailerEntity)
        ServerCallBack('saveCar', trailer, 0)
    end

    save.props = json.encode(lib.getVehicleProperties(save.entity))
    save.vehmodel = GetDisplayNameFromVehicleModel(GetEntityModel(save.entity))
    save.entity = VehToNet(save.entity)
    save.seats = GetVehicleMaxNumberOfPassengers(save.entity)

    if not NetworkDoesNetworkIdExist(save.entity) then
        return false
    end

    ServerCallBack('saveCar', save, 500)
end

RegisterNUICallback('mGarage:PlyInteract', function(data, cb)
    local retval = nil
    if data.action == 'setBlip' then
        local marked = Vehicles.BlipOwnerCar(data.data.plate)
        cb(marked)
        return
    end
    if data.action == 'blipImpound' then
        local garage = GetGaragesData().all[data.data.parking]
        BlipImpound(garage.actioncoords, garage.name)
        cb(true)
        return
    end

    if data.action == 'keys' then
        Vehicles.VehicleKeysMenu(data.plate, function()
            OpenGarage(lastData)
        end)
        cb(true)
        return
    end

    retval = ServerCallBack(data.action, data.data)


    cb(retval)
end)



function ImpoundVehicle(vehicleEntity)
    if DoesEntityExist(vehicleEntity) then
        local date = nil

        local options = {}

        local Garages = GetGaragesData()

        local vehicleClass = GetVehicleType(vehicleEntity)

        lib.array.forEach(Garages.impound, function(garage)
            if lib.table.contains(garage.carType, vehicleClass) then
                local label = garage.jobname or garage.name
                table.insert(options, { value = garage.name, label = label })
            end
        end)


        local input = lib.inputDialog(locale('ImpoundOption1'), {
            { type = 'textarea', label = locale('ImpoundOption2'), required = true, },
            { type = 'number',   label = locale('ImpoundOption3'), icon = 'dollar-sign', min = 0,           default = 0 },
            { type = 'select',   label = 'Select impound',         icon = 'hashtag',     options = options, required = true },
            { type = 'checkbox', label = 'Time seizure', },
        })

        if not input then return end

        if input[4] then
            date = lib.inputDialog(locale('ImpoundOption1'), {
                { type = 'date', label = locale('ImpoundOption4'), icon = { 'far', 'calendar' }, default = false, format = "DD/MM/YYYY" },
                { type = 'time', label = locale('ImpoundOption5'), icon = { 'far', 'clock' },    default = false, format = '24' }
            })
        end


        local dataImpound = {
            entity = VehToNet(vehicleEntity),
            price = input[2],
            reason = input[1],
            dateEndPound = date and date[1],
            hourEndPound = date and date[2],
            garage = input[3]
        }

        ServerCallBack('setimpound', dataImpound)
    end
end

exports.ox_target:addGlobalVehicle({
    {
        name = 'Impound_Car',
        icon = 'fa-solid fa-warehouse',
        label = locale('ImpoundOption14'),
        groups = Config.TargetImpound,
        distance = 5.0,
        onSelect = function(dta)
            ImpoundVehicle(dta.entity)
        end
    },
})

function UnpoundVehicle(plate)
    if not plate then
        local input = lib.inputDialog(locale('ImpoundOption1'), {
            { type = 'input', label = locale('ImpoundOption6'), description = locale('ImpoundOption7'), min = 1, max = 8, required = true, },
        })
        if not input then return end

        plate = input[1]
    end

    if #plate > 8 then
        return lib.error.warning('Plate Max 8 chars')
    end

    plate = plate:upper()

    ServerCallBack('changeimpound', plate)
end

exports('UnpoundVehicle', UnpoundVehicle)
exports('ImpoundVehicle', ImpoundVehicle)
exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)


if Config.Debug then
    RegisterCommand('og', function()
        local GarageZones = GetGaragesData()
        local options = {}

        for k, v in pairs(GarageZones.all) do
            table.insert(options, { value = k, label = k })
        end


        local input = lib.inputDialog('Open Garage', {
            { type = 'select', label = 'Open Garage', icon = 'warehouse', options = options, required = true },

        })

        if not input then return end
        local garage = GarageZones.all[input[1]]
        local ped = PlayerPedId()
        local coords, heading = GetEntityCoords(ped), GetEntityHeading(ped)

        OpenGarage({
            name = garage.name,
            garagetype = garage.garagetype,
            intocar = true,
            showPund = garage.showPund,
            carType = garage.carType,
            spawnpos = {
                vec4(coords.x, coords.y, coords.z, heading),
            }
        })
    end)
end
