--- @class Player
--- @field clientEvent function
--- @field identifier function
--- @field getName function
--- @field getMoney function
--- @field RemoveMoney function
--- @field isAdmin function
--- @field Coords function
--- @field Notify function
--- @field GetJob function


ESX = nil

Core = {}

if Config.Framework == "esx" then
    ESX = exports["es_extended"]:getSharedObject()
end

local query = {
    ['esx'] = {
        queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? ',
        queryImpound =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, metadata = ? WHERE `plate` = ?',
        setImpound =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, `metadata` = ? WHERE TRIM(`plate`) = TRIM(?)',
    },
}



--- @param src number
--- @return Player 
function Core:Player(src)
    self ={}

    self.clientEvent = function(name, ...)
        TriggerClientEvent(name, src, ...)
    end

    self.identifier = function()
        if Config.Framework == "esx" then
            local Player = ESX.GetPlayerFromId(src)
            if Player then
                return Player.identifier
            end
        elseif Config.Framework == "standalone" then
            return GetPlayerIdentifierByType(src, 'license')
        end
        return false
    end

    self.getName = function()
        if Config.Framework == "esx" then
            local Player = ESX.GetPlayerFromId(src)
            if Player then
                return Player.getName()
            end
        elseif Config.Framework == "standalone" then
            return GetPlayerName(src)
        end
        return false
    end

    self.getMoney = function(account)
        if Config.Framework == "esx" then
            local Player = ESX.GetPlayerFromId(src)
            local money = Player.getAccount(account)
            return { money = money.money }
        elseif Config.Framework == "standalone" then
            return true
        end
    end

    self.RemoveMoney = function(account, amount)
        if Config.Framework == "esx" then
            local Player = ESX.GetPlayerFromId(src)
            return Player.removeAccountMoney(account, amount)
        elseif Config.Framework == "standalone" then
            return true
        end
    end

    self.isAdmin = function()
        if Config.Framework == "esx" then
            local Player = ESX.GetPlayerFromId(src)
            return (Player.getGroup() == 'admin')
        elseif Config.Framework == "standalone" then
            return false
        end
    end

    self.Coords = function()
        local entity = GetPlayerPed(src)
        if not entity then return end
        local coords, heading = GetEntityCoords(entity), GetEntityHeading(entity)
        return { x = coords.x, y = coords.y, z = coords.z, w = heading }
    end

    self.Notify = function(data)
        self.clientEvent('mGarage:notify', data)
    end

    self.GetJob = function()
        if Config.Framework == "esx" then
            local job = ESX.GetPlayerFromId(src).getJob()
            return { name = job.name, grade = job.grade, gradeName = job.grade_name }
        elseif Config.Framework == "standalone" then
            return true
        end

        return false
    end

    return self
end

--- Set society money
function Core:SetSotcietyMoney(society, ammount)
    if Config.Framework == "esx" then
        TriggerEvent('esx_addonaccount:getSharedAccount', society, function(account)
            account.addMoney(ammount)
        end)
    elseif Config.Framework == "standalone" then
        return true
    end
end


Querys = query[Config.Framework]
