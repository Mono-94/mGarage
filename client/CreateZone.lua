local isOpenCretor, Cam = false, nil
local MAX_CAM_DISTANCE = 100
local MinY, MaxY = -90.0, 90.0
local MoveSpeed = 0.3
local zoneHeight = 5.0
local zonePoints = {}
local currentZone, currentZoneName, currentZ = nil, nil, nil
local NewZone = {}

local DelZone = function()
    if currentZone then
        currentZone:remove();
    end
end

if Config.Debug then
    RegisterCommand('czone', function(source, args, raw)
        CreateZone('test', true, function(zone)
            print(json.encode(zone, { indent = true }))
        end)
    end)
end

---Create Zone
---@param polyzoneName? string
---@param textui? boolean
---@param cb? function
function CreateZone(polyzoneName, textui, cb)
    local playerPed = cache.ped

    local function setupCamera()
        local x, y, z = table.unpack(GetGameplayCamCoord())
        local pitch, roll, yaw = table.unpack(GetGameplayCamRot(2))
        local fov = GetGameplayCamFov()

        Cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
        SetCamCoord(Cam, x, y, z + 20.0)
        SetCamRot(Cam, pitch, roll, yaw, 2)
        SetCamFov(Cam, fov)
        RenderScriptCams(true, true, 500, true, true)
        FreezeEntityPosition(playerPed, true)
        SetEntityAlpha(playerPed, 0, true)
    end

    local function resetCamera()
        RenderScriptCams(false, true, 500, true, true)
        SetCamActive(Cam, false)
        DetachCam(Cam)
        DestroyCam(Cam, true)
        Cam = nil
    end

    local function toggleUI(show)
        if show then
            lib.showTextUI(locale('TextUiCreateZone'))
        else
            lib.hideTextUI()
        end
    end

    local function Reset()
        if not isOpenCretor then
            toggleUI(textui)
            setupCamera()
        else
            toggleUI(false)
            DelZone()
            currentZone, currentZ, zonePoints, zoneHeight = nil, nil, {}, 4
            FreezeEntityPosition(playerPed, false)
            ResetEntityAlpha(playerPed)
            if Cam then
                resetCamera()
            end
        end
        isOpenCretor = not isOpenCretor
    end


    Reset()

    currentZoneName = polyzoneName

    Citizen.CreateThread(function()
        while isOpenCretor do
            local hit, coords = RayCastGamePlayCamera(80.0)
            if hit then
                DrawLine(coords.x, coords.y, coords.z, coords.x, coords.y, coords.z + 15.0, 255.0, 255.0, 255.0, 250.0)

                if IsControlJustPressed(0, 69) then
                    table.insert(zonePoints, coords)
                    refreshPolyzone()
                elseif IsControlJustPressed(0, 70) then
                    if #zonePoints > 0 then
                        table.remove(zonePoints, #zonePoints)
                        refreshPolyzone()
                    end
                elseif IsControlPressed(0, 334) and zoneHeight > 4 then
                    zoneHeight = zoneHeight - 1
                    refreshPolyzone()
                elseif IsControlPressed(0, 335) then
                    zoneHeight = zoneHeight + 1
                    refreshPolyzone()
                elseif IsControlJustPressed(0, 191) then
                    if #zonePoints > 0 then
                        if #zonePoints == 1 then
                            currentZ = zonePoints[1].z
                        end
                        zonePoints[#zonePoints] = {
                            x = zonePoints[#zonePoints].x,
                            y = zonePoints[#zonePoints].y,
                            z =
                                currentZ
                        }
                        NewZone = { name = currentZoneName, points = json.encode(zonePoints), thickness = zoneHeight, debug = true }

                        if cb then cb(NewZone) end
                        CreateZone()
                    else
                        Config.Notify({ title = 'Create Zone', description = 'No points available', type = 'error', icon = nil })
                        lib.print.warn()
                    end
                elseif IsControlPressed(0, 194) then
                    if cb then cb(false) end
                    CreateZone()
                end
            end

            for i, point in ipairs(zonePoints) do
                DrawText3D(("Point: ~g~%s"):format(i), point)
            end

            camControls()

            Citizen.Wait(0)
        end
    end)
end

exports('CreateZone', CreateZone)

function RayCastGamePlayCamera(distance)
    local playerPed = cache.ped
    local cameraRotation = GetCamRot(Cam, 2)
    local cameraCoord = GetCamCoord(Cam)
    local direction = RotationToDirection(cameraRotation)
    local destination = {
        x = cameraCoord.x + direction.x * distance,
        y = cameraCoord.y + direction.y * distance,
        z = cameraCoord.z + direction.z * distance
    }
    local _, hits, coords, _, entity = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z,
        destination.x, destination.y, destination.z, -1, playerPed, 0))
    return hits, coords, entity
end

function RotationToDirection(rotation)
    local adjustedRotation = {
        x = (math.pi / 180) * rotation.x,
        y = (math.pi / 180) * rotation.y,
        z = (math.pi / 180) * rotation.z
    }
    local direction = {
        x = -math.sin(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        y = math.cos(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        z = math.sin(adjustedRotation.x)
    }
    return direction
end

function refreshPolyzone()
    DelZone()

    if #zonePoints > 0 then
        if #zonePoints == 1 then
            currentZ = zonePoints[1].z
        end
        zonePoints[#zonePoints] = vector3(zonePoints[#zonePoints].x, zonePoints[#zonePoints].y, currentZ)
        currentZone = lib.zones.poly({
            name = currentZoneName,
            debugColour = vec4(51, 54, 92, 50.0),
            points = zonePoints,
            thickness = zoneHeight,
            debug = true
        })
    end
end

function camControls()
    rotateCamInputs()
    moveCamInputs()
end

function rotateCamInputs()
    local newX
    local rAxisX = GetControlNormal(0, 220)
    local rAxisY = GetControlNormal(0, 221)
    local rotation = GetCamRot(Cam, 2)
    local yValue = rAxisY * 5
    local newZ = rotation.z + (rAxisX * -10)
    local newXval = rotation.x - yValue
    if (newXval >= MinY) and (newXval <= MaxY) then
        newX = newXval
    else
        newX = rotation.x
    end
    if newX and newZ then
        SetCamRot(Cam, newX, rotation.y, newZ, 2)
    end
end

function moveCamInputs()
    local x, y, z = table.unpack(GetCamCoord(Cam))
    local pitch, roll, yaw = table.unpack(GetCamRot(Cam, 2))

    local dx = math.sin(-yaw * math.pi / 180) * MoveSpeed
    local dy = math.cos(-yaw * math.pi / 180) * MoveSpeed
    local dz = math.tan(pitch * math.pi / 180) * MoveSpeed

    local dx2 = math.sin(math.floor(yaw + 90.0) % 360 * -1.0 * math.pi / 180) * MoveSpeed
    local dy2 = math.cos(math.floor(yaw + 90.0) % 360 * -1.0 * math.pi / 180) * MoveSpeed

    if IsControlPressed(0, 32) then
        x = x + dx
        y = y + dy
    elseif IsControlPressed(0, 33) then
        x = x - dx
        y = y - dy
    elseif IsControlPressed(0, 35) then
        x = x - dx2
        y = y - dy2
    elseif IsControlPressed(0, 34) then
        x = x + dx2
        y = y + dy2
    elseif IsControlPressed(0, 46) then
        z = z + MoveSpeed
    elseif IsControlPressed(0, 44) then
        z = z - MoveSpeed
    end


    local playerPed = cache.ped
    local playercoords = GetEntityCoords(playerPed)
    if GetDistanceBetweenCoords(playercoords - vector3(x, y, z), true) <= MAX_CAM_DISTANCE then
        SetCamCoord(Cam, x, y, z)
    end
end
