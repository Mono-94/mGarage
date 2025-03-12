Config                = {}

Config.Debug          = false

-- To edit/create garages
Config.CommandGroup   = 'admin'

-- Start defaultGarages.lua
Config.DefaultGarages = true

Config.ClearTimeBlip  = 1000 * 120 -- 2 mins

Config.TargetDistance = 10.0


Config.BlipDefault          = {
    stackBlips = true,
    impound = { label = 'Impound', sprite = 473, color = 17, size = 0.5 },
    garage = { label = 'Garage', sprite = 50, color = 2, size = 0.5 },
    custom = { label = 'Custom Garage', sprite = 50, color = 0, size = 0.5 },
    rent = { label = 'Rent A Car', sprite = 474, color = 0, size = 0.5 },
}

Config.PedAnims             = {
    anims = true,
    list = { "WORLD_HUMAN_AA_SMOKE", "WORLD_HUMAN_AA_COFFEE", "WORLD_HUMAN_CLIPBOARD", "WORLD_HUMAN_MUSICIAN", "WORLD_HUMAN_STUPOR" }
}

-- ox Target Based job and grade min grade
Config.TargetImpound        = {
    -- job     -- min grade
    ['police'] = 0,

}
----------------------------------------------------------------------
-- on Vehicles delete or /dv
Config.ImpoundVehicledelete = true

-- Default impounds names
Config.DefaultImpound       = {
    car = 'Impound Car',
    air = 'Impound Air',
    boat = 'Impound Boat',
    price = 50,
    note = 'Vehicle seized by the municipal service'
}



Config.Notify = function(data)
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


Config.Textui = {
    Showtext = function(text, ...)
        lib.showTextUI(text, ...)
    end,

    HideText = function()
        lib.hideTextUI()
    end
}



---@param eventName string
---@param funct function
function RegisterSafeEvent(eventName, funct)
    RegisterNetEvent(eventName, function(...)
        if GetInvokingResource() ~= nil then return end
        funct(...)
    end)
end
