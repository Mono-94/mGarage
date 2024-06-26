local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end

--Vehicle Label

local VehicleLabel = function(model)
    if not IsModelValid(model) then
        lib.print.warn(model .. ' - Model invalid')
        return 'Unknown'
    end

    local makeName = GetMakeNameFromVehicleModel(model)

    if not makeName then
        lib.print.warn(model .. ' - No Make Name')
        return 'Unknown'
    end

    makeName = makeName:sub(1, 1):upper() .. makeName:sub(2):lower()

    local displayName = GetDisplayNameFromVehicleModel(model)

    displayName = displayName:sub(1, 1):upper() .. displayName:sub(2):lower()
    return makeName .. ' ' .. displayName
end


function OpenGarage(data)
    local getVehicles = ServerCallBack('get', data)

    local PlayerJob = getVehicles.job

    local Vehicles = {}

    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        if getVehicles.vehicles then
            for i = 1, #getVehicles.vehicles do
                local row = getVehicles.vehicles[i]
                if not row.private then
                    local props = json.decode(row.vehicle)
                    row.vehlabel = VehicleLabel(props.model)
                    row.seats = GetVehicleModelNumberOfSeats(props.model)
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
                            table.insert(Vehicles, row)
                        end
                    else
                        if not data.pound then
                            table.insert(Vehicles, row)
                        end
                    end
                end
            end
            if #Vehicles <= 0 then
                return Notification({ title = data.name, description = locale('noVehicles') })
            end

            SendNUI('garage', { vehicles = Vehicles, garage = data })
            ShowNui('setVisibleGarage', true)
        end
    else
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
                lib.print.warn(('vehicle model %s is not valid  at Garage Name %s'):format(v.model:upper(),
                    data.name:upper()))
                isValid = false
            end

            if isValid then
                v.vehlabel = VehicleLabel(v.model)
                table.insert(Vehicles, v)
            end
        end

        if #Vehicles <= 0 then
            return Notification({ title = data.name, description = locale('noVehicles') })
        end

        SendNUI('garage', { vehicles = Vehicles, garage = data })
        ShowNui('setVisibleGarage', true)
    end
end

RegisterNetEvent('mGarage:Client:TaskLeaveVehicle', function()
    TaskLeaveVehicle(cache.ped, cache.vehicle, 0)
end)


function SaveCar(data)
    local vehiclePed = GetVehiclePedIsUsing(cache.ped)

    if not DoesEntityExist(data.entity) then
        data.entity = vehiclePed
    end

    if not DoesEntityExist(data.entity) then
        return false
    end

    local retval = GetVehicleMaxNumberOfPassengers(data.entity)

    local peds = {}
    for i = -1, retval do
        local retval = GetPedInVehicleSeat(data.entity, i)
        if retval > 0 then
            local PlayerServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(retval))
            table.insert(peds, PlayerServerId)
        end
    end
    if #peds > 1 then
        TriggerServerEvent('mGarage:Server:TaskLeaveVehicle', peds)
        Citizen.Wait(2000)
    elseif vehiclePed > 0 then
        TaskLeaveVehicle(cache.ped, cache.vehicle, 0)
        Citizen.Wait(1000)
    end

    data.props = json.encode(lib.getVehicleProperties(data.entity))
    data.vehmodel = GetDisplayNameFromVehicleModel(GetEntityModel(data.entity))
    data.entity = VehToNet(data.entity)

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
    if DoesBlipExist(blip) then
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
        Notification({
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
        local data = {
            entity = VehToNet(data.vehicle),
            price = input[2],
            reason = input[1],
            dateEndPound = input[3],
            hourEndPound = input[4],
            garage = data.impoundName
        }

        ServerCallBack('setimpound', data)
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
        ShowNui('setVisibleGarage', false)

        Vehicles.VehickeKeysMenu(data.plate, function()
            ShowNui('setVisibleGarage', true)
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
                impoundName = Config.TargetImpound[GetJob().name].impoundName
            })
        end
    },
})


exports('UnpoundVehicle', UnpoundVehicle)
exports('ImpoundVehicle', ImpoundVehicle)
exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)
