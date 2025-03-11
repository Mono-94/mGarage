if Config.Debug then
  RegisterCommand("crds", function(_, args)
    local input = lib.inputDialog('mCoords', {
      {
        type = 'select',
        required = true,
        label = 'Type',
        default = 'single',
        options = {
          { label = 'Single coords',   value = 'single' },
          { label = 'Multiple coords', value = 'multi' }
        }
      },
      {
        type = 'select',
        required = true,
        label = 'Name',
        default = 'none',
        options = {
          { label = 'None',    value = 'none' },
          { label = 'Ped',     value = 'ped' },
          { label = 'Vehicle', value = 'car' },
          { label = 'Prop',    value = 'prop' },
        }
      },
      {
        type = 'checkbox',
        label = 'Text UI',
        checked = true
      },
      {
        type = 'checkbox',
        label = 'Switch',
        checked = true
      },
      {
        type = 'input',
        label = 'Car Model',
        default = 'toros'
      },
      {
        type = 'input',
        label = 'Prop Model',
        default = 'prop_parkingpay'
      }
    })

    if not input then return end

    CopyCoords(input[1], input[2], function(table, tableString)
      if table or tableString then
        print(table, tableString)
      end
    end, { textui = input[3], switch = input[4], carModel = input[5], propModel = input[6] })
  end)
end

local mCoords = {}
local ent = {}
local models = { 'baller8', 'banshee3', 'sultanrs', 'rhinehart', 'jubilee' }

function mCoords:CreateTable()
  mCoords.viewEntity = nil
  mCoords.CoordsTable = {}
  mCoords.ped = nil
  mCoords.plyCoords = nil
  mCoords.hit = false
  mCoords.coords = {}
  mCoords.finalHeight = nil
  mCoords.ActiveEntity = nil
  mCoords.switch = true
  mCoords.PedHed = 0.0
  mCoords.carModel = models[math.random(#models)]
  mCoords.propModel = 'prop_parkingpay'
end

mCoords.setEntity = {
  ped = function()
    local entity = ClonePed(mCoords.ped, false, false, true)
    SetEntityCollision(entity, false, true)
    FreezeEntityPosition(entity, true)
    return entity
  end,
  car = function()
    lib.requestModel(mCoords.carModel)
    local entity = CreateVehicle(mCoords.carModel, 0, 0, 0, 0, false, false)
    SetEntityCollision(entity, false, true)
    FreezeEntityPosition(entity, true)
    return entity
  end,
  prop = function()
    lib.requestModel(mCoords.propModel)
    local entity = CreateObject(mCoords.propModel, 0, 0, 0, 0, false, false)
    SetEntityCollision(entity, false, true)
    FreezeEntityPosition(entity, true)
    return entity
  end,
  none = function()
    return nil
  end
}

---Copy Coords
---@class CopyCoords
---@param action string "single" | "multi"
---@param entityType string "ped" | "car" | "prop" | "none"
---@param cb function
---@param options? table
function CopyCoords(action, entityType, cb, options)
  mCoords:CreateTable()

  local text = function()
    if options and options.textui then
      if action == 'multi' then
        lib.showTextUI(locale('copy_coords_multi_textui', action:upper(), entityType, #mCoords.CoordsTable))
      else
        lib.showTextUI(locale('copy_coords_singe_textui', action:upper(), entityType))
      end
    end
  end


  if options then
    if type(options.switch) == 'boolean' then
      mCoords.switch = options.switch
    end
    if type(options.propModel) == 'string' then
      mCoords.propModel = options.propModel
    end
    if type(options.carModel) == 'string' then
      mCoords.carModel = options.carModel
    end
  end


  text()

  mCoords.ped = cache.ped
  mCoords.plyCoords = GetEntityCoords(mCoords.ped)

  local function cloneEntity()
    if mCoords.ActiveEntity then
      DeleteEntity(mCoords.ActiveEntity)
    end
    mCoords.ActiveEntity = mCoords.setEntity[entityType]()
    mCoords.viewEntity = mCoords.ActiveEntity
    return mCoords.ActiveEntity
  end


  local function inCoords(coord)
    if entityType == 'none' then
      return nil
    end
    local newEntity = mCoords.setEntity[entityType]()
    SetEntityCoords(newEntity, coord.x, coord.y, coord.z, 0, 0, 0, false)
    SetEntityHeading(newEntity, coord.w)
    FreezeEntityPosition(newEntity, true)
    SetEntityCollision(newEntity, false, true)
    return newEntity
  end


  local function undoLastCoord()
    if action == 'multi' and # mCoords.CoordsTable > 0 then
      local lastCoord = mCoords.CoordsTable[#mCoords.CoordsTable]
      if DoesEntityExist(lastCoord.ent) then
        DeleteEntity(lastCoord.ent)
      end
      table.remove(mCoords.CoordsTable, #mCoords.CoordsTable)
      if options?.textui then
        text()
      end
    end
  end

  local function deleteAllEntities()
    if DoesEntityExist(mCoords.ActiveEntity) then
      DeleteEntity(mCoords.ActiveEntity)
    end
    for _, v in pairs(ent) do
      if DoesEntityExist(_) then
        DeleteEntity(_)
      end
    end
  end

  local function toVector4Table()
    local toCopy = {}
    for _, v in ipairs(mCoords.CoordsTable) do
      local vecStr = ("vec4(%s,%s,%s,%s)"):format(v.x, v.y, v.z, v.w)
      table.insert(toCopy, vecStr)
    end
    return ('{\n%s\n}'):format(table.concat(toCopy, ',\n'))
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
    if options?.textui then
      text()
    end
    cloneEntity()
  end

  cloneEntity()


  -- disable melee attack
  SetPedConfigFlag(mCoords.ped, 122, true)


  Citizen.CreateThread(function()
    while true do
      mCoords.plyCoords = GetEntityCoords(mCoords.ped)
      mCoords.hit, mCoords.coords = PlayCam(60.0)

      DisableControlAction(0, 140, true)
      DisableControlAction(0, 25, true)
      DisableControlAction(1, 25, true)

      if mCoords.hit and mCoords.coords and mCoords.coords.z then
        local retval, height = GetWaterHeight(mCoords.coords.x, mCoords.coords.y, mCoords.coords.z)
        local terrainHeight = retval and math.abs(height - mCoords.coords.z) >= 1.0 and height or
            mCoords.coords.z
        local displayHeight = mCoords.finalHeight ~= nil and mCoords.finalHeight or terrainHeight

        if mCoords.viewEntity then
          SetEntityCoords(mCoords.viewEntity, mCoords.coords.x, mCoords.coords.y, displayHeight, 0.0, 0.0, 0.0,
            false)
          SetEntityHeading(mCoords.viewEntity, mCoords.PedHed)
        end

        DrawLine(mCoords.plyCoords.x, mCoords.plyCoords.y, mCoords.plyCoords.z, mCoords.coords.x,
          mCoords.coords.y, displayHeight + 0.1, 250, 250, 250, 100)
        DrawMarker(2, mCoords.coords.x, mCoords.coords.y, displayHeight + 0.2, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0,
          0.3, 0.3, 0.3, 250, 250, 250, 100, false, true, 2, false, nil, nil, false)
      end

      if IsControlPressed(0, 14) then          -- scroll wheel
        mCoords.PedHed = mCoords.PedHed + 3.89
      elseif IsControlPressed(0, 15) then      -- scroll wheel
        mCoords.PedHed = mCoords.PedHed - 3.89
      elseif IsControlPressed(0, 172) then     -- Arrow Up
        mCoords.finalHeight = (mCoords.finalHeight or mCoords.coords.z) + 0.1
      elseif IsControlPressed(0, 173) then     -- Arrow Down
        mCoords.finalHeight = (mCoords.finalHeight or mCoords.coords.z) - 0.1
      elseif IsControlJustReleased(0, 44) then -- R
        mCoords.finalHeight = nil
      elseif IsControlJustReleased(0, 69) then -- left click
        mCoords.PedHed = GetEntityHeading(mCoords.viewEntity)
        local newCoords = {
          x = mCoords.coords.x,
          y = mCoords.coords.y,
          z = mCoords.finalHeight or mCoords.coords.z,
          w = mCoords.PedHed
        }
        if action == 'multi' then
          local entityCreated = inCoords(newCoords)
          if entityCreated then
            ent[entityCreated] = entityCreated
          end
          table.insert(mCoords.CoordsTable, newCoords)
          if options?.textui then
            text()
          end
        else
          lib.hideTextUI()
          deleteAllEntities()
          SetPedConfigFlag(mCoords.ped, 122, false)
          cb(newCoords, toVector4Table())
          break
        end
      elseif IsControlJustReleased(0, 70) and action == 'multi' then  --  right click
        undoLastCoord()
      elseif IsControlJustReleased(0, 47) and mCoords.switch then     -- G
        switchEntity()
      elseif IsControlJustReleased(0, 191) and action == 'multi' then -- Enter
        lib.hideTextUI()
        deleteAllEntities()
        SetPedConfigFlag(mCoords.ped, 122, false)
        cb(mCoords.CoordsTable, toVector4Table())
        break
      elseif IsControlPressed(0, 194) then -- Backspace
        lib.hideTextUI()
        deleteAllEntities()
        SetPedConfigFlag(mCoords.ped, 122, false)
        cb(false, false)
        break
      end

      if action == 'multi' then
        for i, point in ipairs(mCoords.CoordsTable) do
          DrawText3D(("[ ~g~%s ~w~]"):format(i), point, 2)
        end
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
