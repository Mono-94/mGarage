EditGarageUI = false

function ShowNui(action, shouldShow)
  SendNUIMessage({ action = action, data = shouldShow })
  if action == 'setVisibleMenu' then
    EditGarageUI = true
  end
  if action == 'setVisibleTooltip' then
    return
  end
  SetNuiFocus(shouldShow, shouldShow)
end

function SendNUI(action, data)
  SendNUIMessage({ action = action, data = data })
end

function ToggleMenu(toggle, action)
  if toggle then
    SetNuiFocus(false, false)
    SendNUI('minimizeMenu', { minimized = true, action = action, })
  else
    SetNuiFocus(true, true)
    SendNUI('minimizeMenu', { minimized = false, action = '' })
  end
end

RegisterNuiCallback('mGarage:Close', function(data, cb)
  ShowNui(data.name, false)
  if data.name == 'setVisibleMenu' then
    EditGarageUI = false
  end
  cb(true)
end)

AddEventHandler('ox_lib:setLocale', function(locale)
  SendNUIMessage({ action = 'mGarage:Lang', data = lib.getLocales() })
end)

RegisterNuiCallback('mGarage:Lang', function(data, cb)
  cb(lib.getLocales())
end)

function EditGarage()
  return EditGarageUI
end

-- Payer Dead
AddEventHandler('gameEventTriggered', function(event, args)
  if event == "CEventNetworkEntityDamage" and args[6] == 1 then
    if not IsEntityAPed(args[1]) or not IsPedAPlayer(args[1]) then
      return
    end
    if args[1] == cache.ped then
      ShowNui('setVisibleGarage', false)
      ShowNui('setVisibleMenu', false)
    end
  end
end)


RegisterNetEvent('mGarage:notify', Config.Notify)


function DrawText3D(text, coords, z)
  if not z then z = 0 end
  local onScreen, _x, _y = World3dToScreen2d(coords.x, coords.y, coords.z + z)
  local scale = 0.5
  if onScreen then
    SetTextScale(scale, scale)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextEntry("STRING")
    SetTextCentre(1)
    AddTextComponentString(text)
    DrawText(_x, _y)
    local factor = (string.len(text)) / 370
    DrawRect(_x, _y + 0.0150, 0.015 + factor, 0.03, 0, 0, 0, 150)
  end
end

---@param eventName string
---@param funct function
function RegisterSafeEvent(eventName, funct)
  RegisterNetEvent(eventName, function(...)
    if GetInvokingResource() ~= nil then return end
    funct(...)
  end)
end
