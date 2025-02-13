if Config.Debug then
  RegisterCommand('ccoords', function(source, args, raw)
    CopyCoords('multi', 'ped', true, function(table, tableString)
      print(json.encode(table, { indent = true }))
      print(tableString)
      lib.setClipboard(tableString)
    end, { carModel = 'adder', propModel = 'prop_bin_05a' })
  end)
end


---Copy Coords
---@class CopyCoords
---@param action string
---@param entityType string
---@param textui boolean
---@param cb function
---@param data? table
function CopyCoords(action, entityType, textui, cb, data)
  local viewEntity
  local CoordsTable = {}
  local ped = cache.ped
  local plyCoords = GetEntityCoords(ped)
  local hit, coords = false, {}
  local close = false
  local finalHeight = nil
  local ActiveEntity = nil
  local PedHed = 0.0

  local carModel = data and data.carModel or 'toros'
  local propModel = data and data.propModel or 'prop_parkingpay'

  if textui then
    lib.showTextUI(locale('TextUiCoords'))
  end

  local entityCreators = {
    ped = function()
      local entity = ClonePed(ped, false, false, true)
      SetEntityCollision(entity, false, true)
      FreezeEntityPosition(entity, true)
      return entity
    end,
    car = function()
      lib.requestModel(carModel)
      local entity = CreateVehicle(carModel, 0, 0, 0, 0, false, false)
      SetEntityCollision(entity, false, true)
      FreezeEntityPosition(entity, true)
      return entity
    end,
    prop = function()
      lib.requestModel(propModel)
      local entity = CreateObject(propModel, 0, 0, 0, 0, false, false)
      SetEntityCollision(entity, false, true)
      FreezeEntityPosition(entity, true)
      return entity
    end,
    none = function()
      return nil
    end
  }

  local function cloneEntity()
    if ActiveEntity then
      DeleteEntity(ActiveEntity)
    end
    ActiveEntity = entityCreators[entityType]()
    viewEntity = ActiveEntity
    return ActiveEntity
  end


  local function inCoords(coord)
    if entityType == 'none' then
      return nil
    end
    local newEntity = entityCreators[entityType]()
    SetEntityCoords(newEntity, coord.x, coord.y, coord.z, 0, 0, 0, false)
    SetEntityHeading(newEntity, coord.w)
    FreezeEntityPosition(newEntity, true)
    SetEntityCollision(newEntity, false, true)
    return newEntity
  end


  local function undoLastCoord()
    if action == 'multi' and #CoordsTable > 0 then
      local lastCoord = CoordsTable[#CoordsTable]
      if DoesEntityExist(lastCoord.ent) then
        DeleteEntity(lastCoord.ent)
      end
      table.remove(CoordsTable, #CoordsTable)
    end
  end

  local function deleteAllEntities()
    if DoesEntityExist(ActiveEntity) then
      DeleteEntity(ActiveEntity)
    end
    for _, v in pairs(CoordsTable) do
      if DoesEntityExist(v.ent) then
        DeleteEntity(v.ent)
      end
    end
  end

  local function toVector4Table()
    local toCopy = {}
    for _, v in ipairs(CoordsTable) do
      local vecStr = ("vec4(%s,%s,%s,%s)"):format(v.x, v.y, v.z, v.w)
      table.insert(toCopy, vecStr)
    end
    local formattedStr = "{\n" .. table.concat(toCopy, ",\n") .. "\n}"
    return formattedStr
  end

  local function switchEntity()
    if entityType == 'ped' then
      entityType = 'car'
    elseif entityType == 'car' then
      entityType = 'prop'
    elseif entityType == 'prop' then
      entityType = 'none'
    else
      entityType = 'ped'
    end
    cloneEntity()
  end

  cloneEntity()

  Citizen.CreateThread(function()
    while not close do
      plyCoords = GetEntityCoords(ped)
      hit, coords = PlayCam(60.0)

      DisablePlayerFiring(ped, true)
      DisableControlAction(0, 140, true)
      DisableControlAction(0, 25, true)
      DisableControlAction(1, 25, true)
      if hit and coords and coords.z then
        local retval, height = GetWaterHeight(coords.x, coords.y, coords.z)
        local terrainHeight = retval and math.abs(height - coords.z) >= 1.0 and height or coords.z
        local displayHeight = finalHeight ~= nil and finalHeight or terrainHeight

        if viewEntity then
          SetEntityCoords(viewEntity, coords.x, coords.y, displayHeight, 0.0, 0.0, 0.0, false)
          SetEntityHeading(viewEntity, PedHed)
        end
        DrawLine(plyCoords.x, plyCoords.y, plyCoords.z, coords.x, coords.y, displayHeight + 0.1, 250, 250, 250, 100)
        DrawMarker(2, coords.x, coords.y, displayHeight + 0.2, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 0.3, 0.3, 0.3, 250, 250,
          250, 100, false, true, 2, false, nil, nil, false)
      end

      if IsControlPressed(0, 14) then          -- scroll wheel
        PedHed = PedHed + 3.89
      elseif IsControlPressed(0, 15) then      -- scroll wheel
        PedHed = PedHed - 3.89
      elseif IsControlPressed(0, 172) then     -- Arrow Up
        finalHeight = (finalHeight or coords.z) + 0.1
      elseif IsControlPressed(0, 173) then     -- Arrow Down
        finalHeight = (finalHeight or coords.z) - 0.1
      elseif IsControlJustReleased(0, 45) then -- R
        finalHeight = nil
      elseif IsControlJustReleased(0, 38) then -- E
        PedHed = GetEntityHeading(viewEntity)
        if action == 'multi' then
          local newCoords = { x = coords.x, y = coords.y, z = finalHeight or coords.z, w = PedHed }
          local ent = inCoords(newCoords)
          newCoords.ent = ent
          table.insert(CoordsTable, newCoords)
        else
          local newCoords = { x = coords.x, y = coords.y, z = finalHeight or coords.z, w = PedHed }
          table.insert(CoordsTable, newCoords)
          cb(newCoords, toVector4Table())
          deleteAllEntities()
          lib.hideTextUI()
          DisablePlayerFiring(ped, false)
          break
        end
      elseif IsControlJustReleased(0, 177) and action == 'multi' then --  BackSpace
        undoLastCoord()
      elseif IsControlJustReleased(0, 47) then                        -- G
        switchEntity()
      elseif IsControlJustReleased(0, 191) and action == 'multi' then -- Enter
        deleteAllEntities()
        cb(CoordsTable, toVector4Table())
        if textui then
          lib.hideTextUI()
        end
        DisablePlayerFiring(ped, false)
        break
      end
      if not EditGarageUI then
        deleteAllEntities()
        lib.hideTextUI()
        DisablePlayerFiring(ped, false)
        break
      end

      for i, point in ipairs(CoordsTable) do
        DrawText3D(("Point ~g~%s"):format(i), point, 2)
      end


      Citizen.Wait(0)
    end
  end)
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

exports('CopyCoords', CopyCoords)
