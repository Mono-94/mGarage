function ShowNui(action, shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendNUIMessage({ action = action, data = shouldShow })
end

function SendNUI(action, data)
  SendNUIMessage({ action = action, data = data })
end

RegisterNuiCallback('mGarage:Close', function(data, cb)
  ShowNui(data.name, false)
  cb(true)
end)


RegisterNuiCallback('mGarage:Lang', function(data, cb)
  cb(Text[Config.Lang])
end)

function Notification(data)
  lib.notify({
    title = data.title,
    description = data.description,
    position = data.position or 'center-left',
    type = data.type or 'warning',
    duration = data.duration or 3000,
    showDuration = true,
  })
end

RegisterNetEvent('mGarage:notify', Notification)


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
