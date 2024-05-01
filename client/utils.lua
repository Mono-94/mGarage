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
