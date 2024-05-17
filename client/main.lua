local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end
--Vehicle Label

local VehicleLabel = function(model)
    local makeName = GetMakeNameFromVehicleModel(model)
    if makeName == nil or not makeName then
        return 'Vehicle MakeName NIL' .. model, lib.print.error(('Vehicle Model [%s] no MakeNanme '):format(model))
    end
    makeName = makeName:sub(1, 1):upper() .. makeName:sub(2):lower()
    local displayName = GetDisplayNameFromVehicleModel(model)
    displayName = displayName:sub(1, 1):upper() .. displayName:sub(2):lower()
    return makeName .. ' ' .. displayName
end



function OpenGarage(data)
    local getVehicles = ServerCallBack('get', data, 500)
    local PlayerJob = getVehicles.job
    local Vehicles = {}
    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        if getVehicles.vehicles then
            if #getVehicles.vehicles <= 0 then
                return Notification({ title = data.name, description = Text[Config.Lang].noVehicles })
            end

            for i = 1, #getVehicles.vehicles do
                local row = getVehicles.vehicles[i]
                local props = json.decode(row.vehicle)
                if props == 0 or props == nil or not props then
                    lib.print.warn(('fail to load vehicle, [ PROPS NIL OR 0 ] Plate: %s, Vehicle ID: %s | Contact an administrator.')
                        :format(row.plate, row.id))
                    break
                end

                row.model2 = GetDisplayNameFromVehicleModel(props.model) -- image from fivem docs?
                row.vehlabel = VehicleLabel(props.model)
                row.seats = GetVehicleModelNumberOfSeats(props.model)
                row.metadata = json.decode(row.metadata)
                row.fuelLevel = props.fuelLevel

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
            return Notification({ title = data.name, description = Text[Config.Lang].noVehicles })
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

exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)

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
            description = Text[Config.Lang].setBlip,
            type = 'warning',
        })
        return true
    end
end



function ImpoundVehicle(data)
    if DoesEntityExist(data.vehicle) then
        local input = lib.inputDialog(Text[Config.Lang].ImpoundOption1, {
            { type = 'textarea', label = Text[Config.Lang].ImpoundOption2, required = true, },
            { type = 'number',   label = Text[Config.Lang].ImpoundOption3, icon = 'dollar-sign',         min = 1 },
            { type = 'date',     label = Text[Config.Lang].ImpoundOption4, icon = { 'far', 'calendar' }, default = false, format = "DD/MM/YYYY" },
            { type = 'time',     label = Text[Config.Lang].ImpoundOption5, icon = { 'far', 'clock' },    default = false, format = '24' }
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
        local input = lib.inputDialog(Text[Config.Lang].ImpoundOption1, {
            { type = 'input', label = Text[Config.Lang].ImpoundOption6, description = Text[Config.Lang].ImpoundOption7, min = 1, max = 8, required = true, },
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
        label = Text[Config.Lang].ImpoundOption14,
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

RegisterCommand('unpound', function(source, args, raw)
    UnpoundVehicle()
end)
