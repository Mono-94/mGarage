local mZone = {}

function mZone:CreateTable()
    self.isOpen = false
    self.CamEntity = nil
    self.MAX_CAM_DISTANCE = 100
    self.MinY = -100.0
    self.MaxY = 100.0
    self.MoveSpeed = 0.3
    self.zoneHeight = 5.0
    self.zonePoints = {}
    self.currentZone = nil
    self.currentZoneName = nil
    self.currentZ = nil
    self.NewZone = {}
    self.ped = cache.ped
    self.textui = false
end

function mZone:DeleteCurrent()
    if self.currentZone then
        self.currentZone:remove()
    end
end

function mZone:SetNewPoint()
    if #self.zonePoints == 1 then
        self.currentZ = self.zonePoints[1].z
    end

    self.zonePoints[#self.zonePoints] = {
        x = self.zonePoints[#self.zonePoints].x,
        y = self.zonePoints[#self.zonePoints].y,
        z = self.currentZ
    }

    self.NewZone = {
        name = self.currentZoneName,
        points = self.zonePoints,
        thickness = self.zoneHeight
    }
end

function mZone:RefreshPolyzone()
    self:DeleteCurrent()

    if #self.zonePoints > 0 then
        self:SetNewPoint()

        self.currentZone = lib.zones.poly({
            name = self.currentZoneName,
            debugColour = vec4(51, 54, 92, 50.0),
            points = self.zonePoints,
            thickness = self.zoneHeight,
            debug = true
        })
    end
end

function mZone:SetCam()
    local x, y, z = table.unpack(GetGameplayCamCoord())
    local pitch, roll, yaw = table.unpack(GetGameplayCamRot(2))
    local fov = GetGameplayCamFov()

    self.CamEntity = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(self.CamEntity, x, y, z)
    SetCamRot(self.CamEntity, pitch, roll, yaw, 2)
    SetCamFov(self.CamEntity, fov)
    RenderScriptCams(true, true, 500, true, true)
    FreezeEntityPosition(self.ped, true)
    SetEntityAlpha(self.ped, 0, true)
end

function mZone:ClearCam()
    RenderScriptCams(false, true, 500, true, true)
    SetCamActive(self.CamEntity, false)
    DetachCam(self.CamEntity)
    DestroyCam(self.CamEntity, true)
    self.CamEntity = nil
end

function mZone:ToggleUI(show)
    if not self.textui then return end
    if show then
        lib.showTextUI(locale('TextUiCreateZone'))
    else
        lib.hideTextUI()
    end
end

function mZone:Reset()
    if not self.isOpen then
        self:ToggleUI(true)
        self:SetCam()
    else
        self:ToggleUI(false)
        self:DeleteCurrent()
        self.currentZone, self.currentZ, self.zonePoints, self.zoneHeight = nil, nil, {}, 4
        FreezeEntityPosition(self.ped, false)
        ResetEntityAlpha(self.ped)
        if self.CamEntity then
            self:ClearCam()
        end
    end

    self.isOpen = not self.isOpen
end

---@param name string
---@param textui boolean
---@param cb function
function CreateZone(name, textui, cb)
    mZone:CreateTable()

    mZone.currentZoneName = name
    mZone.textui = textui

    mZone:Reset()

    Citizen.CreateThread(function()
        while mZone.isOpen do
            local hit, coords = mZone:RayCastGamePlayCamera(80.0)
            if hit then
                DrawLine(coords.x, coords.y, coords.z, coords.x, coords.y, coords.z + 15.0, 255.0, 255.0, 255.0, 250.0)

                if IsControlJustPressed(0, 69) then
                    table.insert(mZone.zonePoints, coords)
                    mZone:RefreshPolyzone()
                elseif IsControlJustPressed(0, 70) then
                    if #mZone.zonePoints > 0 then
                        table.remove(mZone.zonePoints, #mZone.zonePoints)
                        mZone:RefreshPolyzone()
                    end
                elseif IsControlPressed(0, 334) and mZone.zoneHeight > 4 then
                    mZone.zoneHeight = mZone.zoneHeight - 1
                    mZone:RefreshPolyzone()
                elseif IsControlPressed(0, 335) then
                    mZone.zoneHeight = mZone.zoneHeight + 1
                    mZone:RefreshPolyzone()
                elseif IsControlJustPressed(0, 191) then
                    if #mZone.zonePoints > 0 then
                        mZone:Reset()
                        if cb then cb(mZone.NewZone) end
                        break
                    else
                        Config.Notify({ title = 'Create Zone', description = 'No points available', type = 'error', icon = nil })
                    end
                elseif IsControlPressed(0, 194) then
                    if cb then cb(false) end
                    mZone:Reset()
                    break
                end
            end

            for i, point in ipairs(mZone.zonePoints) do
                DrawText3D(("Point: ~g~%s"):format(i), point)
            end

            mZone:CamControls()

            Citizen.Wait(0)
        end
    end)
end

function mZone:RayCastGamePlayCamera(distance)
    local cameraRotation = GetCamRot(self.CamEntity, 2)
    local cameraCoord = GetCamCoord(self.CamEntity)
    local direction = self:RotationToDirection(cameraRotation)
    local destination = {
        x = cameraCoord.x + direction.x * distance,
        y = cameraCoord.y + direction.y * distance,
        z = cameraCoord.z + direction.z * distance
    }
    local _, hits, coords, _, entity = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z,
        destination.x, destination.y, destination.z, -1, self.ped, 0))
    return hits, coords, entity
end

function mZone:RotationToDirection(rotation)
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

function mZone:CamControls()
    self:RotateCamInputs()
    self:MoveCamInputs()
end

function mZone:RotateCamInputs()
    local newX
    local rAxisX = GetControlNormal(0, 220)
    local rAxisY = GetControlNormal(0, 221)
    local rotation = GetCamRot(self.CamEntity, 2)
    local yValue = rAxisY * 5
    local newZ = rotation.z + (rAxisX * -10)
    local newXval = rotation.x - yValue
    if (newXval >= self.MinY) and (newXval <= self.MaxY) then
        newX = newXval
    else
        newX = rotation.x
    end
    if newX and newZ then
        SetCamRot(self.CamEntity, newX, rotation.y, newZ, 2)
    end
end

function mZone:MoveCamInputs()
    local x, y, z = table.unpack(GetCamCoord(self.CamEntity))
    local pitch, roll, yaw = table.unpack(GetCamRot(self.CamEntity, 2))

    local dx = math.sin(-yaw * math.pi / 180) * self.MoveSpeed
    local dy = math.cos(-yaw * math.pi / 180) * self.MoveSpeed
    local dz = math.tan(pitch * math.pi / 180) * self.MoveSpeed

    local dx2 = math.sin(math.floor(yaw + 90.0) % 360 * -1.0 * math.pi / 180) * self.MoveSpeed
    local dy2 = math.cos(math.floor(yaw + 90.0) % 360 * -1.0 * math.pi / 180) * self.MoveSpeed

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
        z = z + self.MoveSpeed
    elseif IsControlPressed(0, 44) then
        z = z - self.MoveSpeed
    end

    local playercoords = GetEntityCoords(self.ped)
    if GetDistanceBetweenCoords(playercoords - vector3(x, y, z), true) <= self.MAX_CAM_DISTANCE then
        SetCamCoord(self.CamEntity, x, y, z)
    end
end

exports('CreateZone', CreateZone)

if Config.Debug then
    RegisterCommand('czone', function(source, args, raw)
        CreateZone('test', true, function(zone)
            print(json.encode(zone, { indent = true }))
        end)
    end)
end
