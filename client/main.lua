local ServerCallBack = function(action, data, delay)
    return lib.callback.await('mGarage:Interact', delay or false, action, data)
end


function OpenGarage(data)
    if data.garagetype == 'impound' or data.garagetype == 'garage' then
        local getVehicles = ServerCallBack('get', data)
        local Vehicles = {}
        print(#getVehicles)
        if getVehicles then
            if #getVehicles <= 0 then
                Notification({
                    title = data.name,
                    description = Text[Config.Lang].noVehicles

                })
                return
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

function SaveCar(data)
    if not data.entity then
        data.entity = cache.vehicle
    end
    if not DoesEntityExist(data.entity) then return end
    TaskLeaveVehicle(cache.ped, data.entity, 0)
    Citizen.Wait(1000)
    data.props = json.encode(lib.getVehicleProperties(data.entity))
    data.entity = VehToNet(data.entity)
    ServerCallBack('saveCar', data, 500)
end

exports('OpenGarage', OpenGarage)
exports('SaveCar', SaveCar)

local blipcar = function(coords, plate)
    local entity = AddBlipForCoord(coords.x, coords.y, coords.z)

    SetBlipSprite(entity, 523)
    SetBlipDisplay(entity, 2)
    SetBlipScale(entity, 1.0)
    SetBlipColour(entity, 49)
    SetBlipAsShortRange(entity, false)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString('Vehicle - ' .. plate)
    EndTextCommandSetBlipName(entity)

    if entity then
        Notification({
            title = 'Garage',
            description = Text[Config.Lang].setBlip,
            type = 'warning',
        })
    end

    Citizen.SetTimeout(Config.CarBlipTime, function()
        RemoveBlip(entity)
    end)
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
