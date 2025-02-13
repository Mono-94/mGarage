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

local VehicleTypes = {
    ['car'] = { 'automobile', 'bicycle', 'bike', 'quadbike', 'trailer', 'amphibious_quadbike', 'amphibious_automobile' },
    ['boat'] = { 'submarine', 'submarinecar', 'boat' },
    ['air'] = { 'blimp', 'heli', 'plane' },
}

function GetDefaultImpound(type)
    for vehicleType, types in pairs(VehicleTypes) do
        for _, v in ipairs(types) do
            if v == type or type == vehicleType then
                return Config.DefaultImpound[vehicleType]
            end
        end
    end
end