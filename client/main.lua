local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end

local lastData = {}


function OpenGarage(data)
    local VehiclesData = ServerCallBack('get', data)

    lastData = data

    local PlayerJob = Core:GetPlayerJob()

    local SendData = {}

    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        for i = 1, #VehiclesData do
            local row = VehiclesData[i]
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

                if data.garagetype == 'impound' then
                    if row.pound and row.stored == 0 then
                        row.infoimpound = json.encode(row.metadata.pound)
                        table.insert(SendData, row)
                    end
                else
                    if not data.pound then
                        table.insert(SendData, row)
                    end
                end
            end
        end
    elseif data.garagetype == 'custom' then
        for k, v in pairs(data.defaultCars) do
            local isValid = true
            local isModelValid = IsModelValid(v.model)
            if isModelValid then
                if type(v.grades) == 'table' then
                    local grade = lib.table.contains(v.grades, PlayerJob.grade)
                    local gradeName = lib.table.contains(v.grades, PlayerJob.gradeName)
                    if not grade and not gradeName then
                        isValid = false
                    end
                elseif type(v.grades) == 'number' then
                    local grade = v.grades == PlayerJob.grade
                    local gradeName = v.grades == PlayerJob.gradeName
                    if not grade and not gradeName then
                        isValid = false
                    end
                end
            else
                lib.print.warn(('vehicle model %s is not valid at Garage Name %s'):format(v.model:upper(),
                    data.name:upper()))
                isValid = false
            end

            if isValid then
                v.parking = data.name
                v.vehlabel = Vehicles.GetVehicleLabel(v.model)
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

function SaveCar(data)
    local vehiclePed = GetVehiclePedIsUsing(cache.ped)

    if not DoesEntityExist(data.entity) then
        data.entity = vehiclePed
    end

    if not DoesEntityExist(data.entity) then
        return false
    end

    data.props = json.encode(lib.getVehicleProperties(data.entity))
    data.vehmodel = GetDisplayNameFromVehicleModel(GetEntityModel(data.entity))
    data.entity = VehToNet(data.entity)
    data.seats = GetVehicleMaxNumberOfPassengers(data.entity)

    if not NetworkDoesNetworkIdExist(data.entity) then
        return false
    end

    if data.garagetype == 'custom' then
        ServerCallBack('saveCustomCar', data, 500)
    else
        ServerCallBack('saveCar', data, 500)
    end
end

local blip    = nil
local timer

local blipcar = function(coords, plate)
    if blip and DoesBlipExist(blip) then
        RemoveBlip(blip)
        SetBlipRoute(blip, false)
        timer:forceEnd(false)
    end

    blip = AddBlipForCoord(coords.x, coords.y, coords.z)

    SetBlipSprite(blip, 523)
    SetBlipDisplay(blip, 2)
    SetBlipScale(blip, 1.0)
    SetBlipColour(blip, 49)
    SetBlipAsShortRange(blip, false)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString('Vehicle - ' .. plate)
    EndTextCommandSetBlipName(blip)
    SetBlipRoute(blip, true)

    timer = lib.timer(Config.ClearTimeBlip, function()
        SetBlipRoute(blip, false)
        RemoveBlip(blip)
    end, true)

    if blip then
        Config.Notify({
            title = 'Garage',
            description = locale('setBlip'),
            type = 'warning',
        })
        return true
    end
end



function ImpoundVehicle(data)
    if DoesEntityExist(data.vehicle) then
        local input = lib.inputDialog(locale('ImpoundOption1'), {
            { type = 'textarea', label = locale('ImpoundOption2'), required = true, },
            { type = 'number',   label = locale('ImpoundOption3'), icon = 'dollar-sign',         min = 1 },
            { type = 'date',     label = locale('ImpoundOption4'), icon = { 'far', 'calendar' }, default = false, format = "DD/MM/YYYY" },
            { type = 'time',     label = locale('ImpoundOption5'), icon = { 'far', 'clock' },    default = false, format = '24' }
        })
        if not input then return end

        local dataImpound = {
            entity = VehToNet(data.vehicle),
            price = input[2],
            reason = input[1],
            dateEndPound = input[3],
            hourEndPound = input[4],
            garage = data.impoundName
        }

        ServerCallBack('setimpound', dataImpound)
    end
end

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

RegisterNUICallback('mGarage:PlyInteract', function(data, cb)
    local retval = nil

    retval = ServerCallBack(data.action, data.data)

    if data.action == 'setBlip' then
        blipcar(retval, data.data.plate)
    elseif data.action == 'keys' then
        Vehicles.VehicleKeysMenu(data.plate, function()
            OpenGarage(lastData)
        end)
    end

    cb(retval)
end)


-- Vehicle Impound

local impoundGroups = {}
for job, data in pairs(Config.TargetImpound) do
    impoundGroups[job] = data.minGrades
end

exports.ox_target:addGlobalVehicle({
    {
        name = 'Impound_Car',
        icon = 'fa-solid fa-warehouse',
        label = locale('ImpoundOption14'),
        groups = impoundGroups,
        distance = 5.0,
        onSelect = function(vehicle)
            ImpoundVehicle({
                vehicle = vehicle.entity,
                impoundName = Config.TargetImpound[Core:GetPlayerJob().name].impoundName
            })
        end
    },
})


exports('UnpoundVehicle', UnpoundVehicle)
exports('ImpoundVehicle', ImpoundVehicle)
exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)
