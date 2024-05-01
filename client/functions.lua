local isOpenCretor, Cam = false, nil
local MAX_CAM_DISTANCE = 100
local MinY, MaxY = -90.0, 90.0
local MoveSpeed = 0.15
local zoneHeight = 4
local zonePoints = {}
local currentZone, currentZoneName, currentZ = nil, nil, nil
local NewZone = {}

function CreateZone(polyzoneName, cb)
  local playerPed = cache.ped
  if not isOpenCretor then
    lib.showTextUI(
      '[MB1] Set Point   \n  [MB2] Delete Last Point   \n  [SCROLL] Thickness  \n  [ENTER] Save points  \n  [BACKSPACE] Close ')
    currentZoneName = polyzoneName;
    local x, y, z = table.unpack(GetGameplayCamCoord())
    local pitch, roll, yaw = table.unpack(GetGameplayCamRot(2))
    local fov = GetGameplayCamFov()
    Cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(Cam, x, y, z + 20.0)
    SetCamRot(Cam, pitch, roll, yaw, 2)
    SetCamFov(Cam, fov)
    RenderScriptCams(true, true, 500, true, true)
    FreezeEntityPosition(playerPed, true)
  else
    lib.hideTextUI()
    destroyZone(currentZone)
    currentZoneName, currentZone, currentZ, zonePoints, zoneHeight = polyzoneName, nil, nil, {}, 4
    FreezeEntityPosition(playerPed, false)
    if Cam then
      RenderScriptCams(false, true, 500, true, true)
      SetCamActive(Cam, false)
      DetachCam(Cam)
      DestroyCam(Cam, true)
      Cam = nil
    end
  end

  isOpenCretor = not isOpenCretor

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
        elseif IsControlPressed(0, 334) then
          if zoneHeight > 4 then
            zoneHeight = zoneHeight - 1
            refreshPolyzone()
          end
        elseif IsControlPressed(0, 335) then
          zoneHeight = zoneHeight + 1
          refreshPolyzone()
        elseif IsControlJustPressed(0, 191) then
          if #zonePoints > 0 then
            if #zonePoints == 1 then
              currentZ = zonePoints[1].z
            end
            zonePoints[#zonePoints] = { x = zonePoints[#zonePoints].x, y = zonePoints[#zonePoints].y, z = currentZ }

            NewZone = { name = currentZoneName, points = json.encode(zonePoints), thickness = zoneHeight, debug = true }

            cb(NewZone)

            CreateZone()
          else
            print('No points avaible')
          end
        elseif IsControlPressed(0, 194) then
          cb(false)
          CreateZone()
        end
      end

      camControls()
      DisabledControls()

      Citizen.Wait(0)
    end
  end)
end

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

function destroyZone(zone)
  if zone then
    zone:remove();
  end
end

function refreshPolyzone()
  destroyZone(currentZone)
  if #zonePoints > 0 then
    if #zonePoints == 1 then
      currentZ = zonePoints[1].z
    end
    zonePoints[#zonePoints] = vector3(zonePoints[#zonePoints].x, zonePoints[#zonePoints].y, currentZ)
    currentZone = lib.zones.poly({
      name = currentZoneName,
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
  end
  if newX and newZ then
    SetCamRot(Cam, vector3(newX, rotation.y, newZ), 2)
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

-- #endregion

function DisabledControls()
  EnableControlAction(0, 32, true)
  EnableControlAction(0, 33, true)
  EnableControlAction(0, 34, true)
  EnableControlAction(0, 35, true)
  EnableControlAction(0, 44, true)
  EnableControlAction(0, 46, true)
  EnableControlAction(0, 69, true)
  EnableControlAction(0, 70, true)
  EnableControlAction(0, 322, true)
  EnableControlAction(0, 220, true)
  EnableControlAction(0, 221, true)
  DisableControlAction(0, 24, true)  -- Attack
  DisableControlAction(0, 257, true) -- Attack 2
  DisableControlAction(0, 25, true)  -- Aim
  DisableControlAction(0, 263, true) -- Melee Attack 1
  DisableControlAction(0, 45, true)  -- Reload
  DisableControlAction(0, 73, true)  -- Disable clearing animation
  DisableControlAction(2, 199, true) -- Disable pause screen
  DisableControlAction(0, 59, true)  -- Disable steering in vehicle
  DisableControlAction(0, 71, true)  -- Disable driving forward in vehicle
  DisableControlAction(0, 72, true)  -- Disable reversing in vehicle
  DisableControlAction(2, 36, true)  -- Disable going stealth
  DisableControlAction(0, 47, true)  -- Disable weapon
  DisableControlAction(0, 264, true) -- Disable melee
  DisableControlAction(0, 140, true) -- Disable melee
  DisableControlAction(0, 141, true) -- Disable melee
  DisableControlAction(0, 142, true) -- Disable melee
  DisableControlAction(0, 143, true) -- Disable melee
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

function PlayCam(distance)
  local cameraRotation = GetGameplayCamRot()
  local cameraCoord = GetGameplayCamCoord()
  local direction = RotationToDirection(cameraRotation)
  local destination = {
    x = cameraCoord.x + direction.x * distance,
    y = cameraCoord.y + direction.y * distance,
    z = cameraCoord.z + direction.z * distance
  }
  local a, hit, coords, d, entity = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z,
    destination.x, destination.y, destination.z, -1, cache.ped, 0))
  return hit, coords, entity, a, d
end

--- Copy Coords
---comment
---@param cb function
function CopyCoords(action, cb)
  local viewEntity
  local CoordsTable = {}
  local ped = cache.ped
  local plyCoords = GetEntityCoords(ped)
  local esPedActivo = false
  local hit, coords
  local close = false
  local act = false
  local finalHeight
  lib.showTextUI(
    '[E] Set Coords  \n  [SCROLL] Heading  \n  [BACKSPACE] Delete Last coords  \n  [G] None/Ped/Vehicle  \n  [ENTER] Save Coords   \n  [X] Close ')
  local function Clone()
    viewEntity = ClonePed(ped, false, false, true)
    RequestAnimDict("amb@code_human_in_bus_passenger_idles@male@sit@idle_a")
    while (not HasAnimDictLoaded("amb@code_human_in_bus_passenger_idles@male@sit@idle_a")) do Citizen.Wait(0) end
    SetEntityCollision(viewEntity, false, true)

    return viewEntity
  end

  local function InCoords(coord, isped)
    local InCoords = nil

    if not isped and action == 'multi' then
      if not IsModelInCdimage('toros') then return end
      RequestModel('toros')
      while not HasModelLoaded('toros') do
        Wait(0)
      end
      InCoords = CreateVehicle('toros', coord.x, coord.y, coord.z, coord.w, false, false)
      FreezeEntityPosition(InCoords, true)
      SetEntityCollision(InCoords, false, true)
      SetEntityAlpha(InCoords, 0.8)
      SetEntityDrawOutline(InCoords, true)
      SetEntityDrawOutlineColor(23, 191, 54, 0.6)
    elseif action == 'multi' then
      InCoords = ClonePed(ped, false, false, true)
      RequestAnimDict("amb@code_human_in_bus_passenger_idles@male@sit@idle_a")
      while (not HasAnimDictLoaded("amb@code_human_in_bus_passenger_idles@male@sit@idle_a")) do Citizen.Wait(0) end
      SetEntityAlpha(InCoords, 0.6)
      SetEntityCoords(InCoords, coord.x, coord.y, coord.z)
      SetEntityHeading(InCoords, coord.w)
    end
    return InCoords
  end

  local function Car()
    if not IsModelInCdimage('toros') then return end
    RequestModel('toros')
    while not HasModelLoaded('toros') do
      Wait(0)
    end
    viewEntity = CreateVehicle('toros', coords.x, coords.y, finalHeight, coords.w, false, false)
    SetEntityCollision(viewEntity, false, true)
    act = true
    return viewEntity
  end

  local function UndoLastCoord()
    if action == 'multi' and #CoordsTable > 0 then
      local lastCoord = CoordsTable[#CoordsTable]
      DeleteEntity(lastCoord.ent)
      table.remove(CoordsTable, #CoordsTable)
    end
  end


  local entidadActiva = nil

  PedHed = GetEntityHeading(viewEntity)


  Citizen.CreateThread(function()
    while not close do
      plyCoords = GetEntityCoords(ped)
      hit, coords = PlayCam(60.0)

      if hit then
        local retval, height = GetWaterHeight(coords.x, coords.y, coords.z)

        if retval and math.abs(height - coords.z) >= 1.0 then
          finalHeight = height
        else
          finalHeight = coords.z
        end
        SetEntityCoords(viewEntity, coords.x, coords.y, finalHeight, 0.0, 0.0, 0.0, false)
        SetEntityHeading(viewEntity, PedHed)
        DrawLine(plyCoords.x, plyCoords.y, plyCoords.z, coords.x, coords.y, finalHeight + 0.1, 0, 0, 0, 100)
        DrawMarker(2, coords.x, coords.y, finalHeight + 0.2, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 0.3, 0.3, 0.3, 0, 0, 0, 100,
          false, true, 2, false, nil, nil, false)
      end
      if IsControlPressed(0, 14) then          -- Sroll Up / Heading +
        PedHed = PedHed + 3.89
      elseif IsControlPressed(0, 15) then      --Scroll Down / Heading -
        PedHed = PedHed - 3.89
      elseif IsControlJustReleased(0, 38) then -- E Set Coords
        PedHed = GetEntityHeading(viewEntity)
        local newCoords = { x = coords.x, y = coords.y, z = coords.z, w = PedHed }
        local ent = InCoords(newCoords, false)
        newCoords = { x = coords.x, y = coords.y, z = coords.z, w = PedHed, ent = ent }
        if action == 'multi' then
          table.insert(CoordsTable, newCoords)
        else
          cb(newCoords)
          DeleteEntity(entidadActiva)
          lib.hideTextUI()
          break
        end
      elseif IsControlJustReleased(0, 177) then
        UndoLastCoord()
      elseif IsControlJustReleased(0, 47) then
        if not act then
          if entidadActiva then
            DeleteEntity(entidadActiva)
            entidadActiva = nil
          end
          if not esPedActivo and action == 'single' then
            viewEntity = Clone()
            entidadActiva = viewEntity
            esPedActivo = true
          elseif action == 'multi' then
            viewEntity = Car()
            entidadActiva = viewEntity
            esPedActivo = false
          else
            esPedActivo = false
          end
        else
          act = false
          DeleteEntity(entidadActiva)
        end
      elseif IsControlJustReleased(0, 191) and action == 'multi' then
        DeleteEntity(entidadActiva)
        for k, v in pairs(CoordsTable) do
          if DoesEntityExist(v.ent) then
            DeleteEntity(v.ent)
          end
        end
        cb(CoordsTable)
        lib.hideTextUI()
        break
      elseif IsControlJustReleased(0, 73) then
        DeleteEntity(entidadActiva)
        for k, v in pairs(CoordsTable) do
          if DoesEntityExist(v.ent) then
            DeleteEntity(v.ent)
          end
        end
        cb(CoordsTable)
        lib.hideTextUI()
        break
        cb(false)
      end

      Citizen.Wait(0)
    end
  end)
end

RegisterCommand('coords', function(source, args, raw)
  CopyCoords('multi', function(coords)
    print(json.encode(coords, { indent = true }))
  end)
end)


function VehicleLabel(model)
  local makeName = GetMakeNameFromVehicleModel(model)
  makeName = makeName:sub(1, 1):upper() .. makeName:sub(2):lower()
  local displayName = GetDisplayNameFromVehicleModel(model)
  displayName = displayName:sub(1, 1):upper() .. displayName:sub(2):lower()
  return makeName .. ' ' .. displayName
end
