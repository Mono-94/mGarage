local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end


function OpenGarage(data)
    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        local getVehicles = ServerCallBack('get', data)
        local Vehicles = {}
        if getVehicles then
            if #getVehicles <= 0 then
                return Notification({ title = data.name, description = Text[Config.Lang].noVehicles })
            end
            for i = 1, #getVehicles do
                local row = getVehicles[i]
                local props = json.decode(row.vehicle)
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
            v.vehlabel = VehicleLabel(v.model)
        end
        SendNUI('garage', { garage = data })
        ShowNui('setVisibleGarage', true)
    end
end

RegisterNetEvent('mGarage:Client:TaskLeaveVehicle', function()
    TaskLeaveVehicle(cache.ped, cache.vehicle, 0)
end)

function SaveCar(data)
    if not data.entity then
        data.entity = cache.vehicle
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
    if #peds > 0 then
        TriggerServerEvent('mGarage:Server:TaskLeaveVehicle', peds)
        Citizen.Wait(2000)
    end
    data.props = json.encode(lib.getVehicleProperties(data.entity))
    data.entity = VehToNet(data.entity)
    ServerCallBack('saveCar', data, 500)
end

exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)

local blip    = nil
local timer
local blipcar = function(coords, plate)
    if DoesBlipExist(blip) then
        RemoveBlip(blip)
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

    timer = lib.timer(Config.CarBlipTime, function()
        RemoveBlip(blip)
        print("timer ended")
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
        local data = {
            entity = VehToNet(data.vehicle),
            price = input[2],
            reason = input[1],
            dateEndPound = input[3],
            hourEndPound = input[4],
            garage = data.impoundName
        }
        print(json.encode(input, { indent = true }))
        if not input then return end
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


RegisterCommand('mGarage:impound', function(source, args, raw)
    local ped = PlayerPedId()
    local vehicleEntity = GetVehiclePedIsIn(ped, false)
    if DoesEntityExist(vehicleEntity) then
        ImpoundVehicle({
            vehicle = vehicleEntity,
            impoundName = 'Impound Car'
        })
    else
        print('No Vehicle')
    end
end)

RegisterCommand('mGarage:unpound', function(source, args, raw)
    UnpoundVehicle()
    -- or UnpoundVehicle('MONO 420')
end)
