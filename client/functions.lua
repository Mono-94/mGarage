local EditGarageUI = false

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

RegisterNuiCallback('mGarage:Close', function(data, cb)
  ShowNui(data.name, false)
  if data.name == 'setVisibleMenu' then
    EditGarageUI = false
  end
  cb(true)

end)

AddEventHandler('ox_lib:setLocale',function (locale)
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

--Notification
function Notification(data)
  lib.notify({
    title = data.title,
    description = data.description,
    position = data.position or 'bottom-right',
    type = data.type or 'warning',
    icon = data.icon or 'car',
    duration = data.duration or 3000,
    showDuration = true,
  })
end

RegisterNetEvent('mGarage:notify', Notification)

--Textui
function TextUI(name)
  lib.showTextUI('[ E ] ' .. name, {
    position = "bottom-center",
    icon = 'square-parking',
    alignIcon = 'top',
    iconColor = '#7acf3a',
    style = {
      borderRadius = 5,
      backgroundColor = '#141414',
      fontSize = '14px',
    }
  })
end

function HideTextUI()
  lib.hideTextUI()
end

