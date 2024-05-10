Core = {}

if Config.Framework == "esx" then
    Core.shared= exports["es_extended"]:getSharedObject()
elseif Config.Framework == "ox" then
    Core.shared= require '@ox_core.lib.init'
elseif Config.FrameWork == "qb" then
    Core.shared = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "LG" then
    Core.shared = exports.LegacyFramework:ReturnFramework()
end

function Core.Player(src)
    local self = {}

    self.identifier = function()
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            if Player then
                return Player.identifier
            end
        elseif Config.Framework == "qb" then
            local Player = Core.shared.Functions.GetPlayer(src)
            if Player then
                return Player.PlayerData.citizenid
            end
        elseif Config.Framework == "standalone" then
            return GetPlayerIdentifierByType(src, 'license')
        elseif Config.Framework == "ox" then
            local player = Core.shared.GetPlayer(src)
            if player then
                return player.charId
            end
        elseif Config.Framework == "LG" then
            local playerData = LegacyFramework.SvPlayerFunctions.GetPlayerData(src)[1]
            return playerData?.charName
        end
        return false
    end

    self.getName = function()
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            if Player then
                return Player.getName()
            end
        elseif Config.Framework == "qb" then
            local Player = Core.shared.Functions.GetPlayer(src)
            if Player then
                local firstname = Player.PlayerData.charinfo.firstname
                local lastname = Player.PlayerData.charinfo.lastname
                return firstname .. ' ' .. lastname
            end
        elseif Config.Framework == "standalone" then
            return GetPlayerName(src)
        elseif Config.Framework == "ox" then
            local Player = Core.shared.GetPlayer(src)
            if Player then
                return Player.get('name')
            end
        elseif Config.Framework == "LG" then
            return GetPlayerName(src)
        end
        return false
    end

    self.getMoney = function(account)
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            local money = Player.getAccount(account)
            return { money = money.money }
        elseif Config.Framework == "qb" then

        elseif Config.Framework == "standalone" then

        elseif Config.Framework == "ox" then

        elseif Config.Framework == "LG" then

        end
    end

    self.RemoveMoney = function(account, ammount)
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            return Player.removeAccountMoney(account, ammount)
        elseif Config.Framework == "qb" then

        elseif Config.Framework == "standalone" then

        elseif Config.Framework == "ox" then

        elseif Config.Framework == "LG" then

        end
    end

    self.isAdmin = function()
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            return (Player.getGroup() == 'admin')
        elseif Config.Framework == "qb" then

        elseif Config.Framework == "standalone" then
            return true
        elseif Config.Framework == "ox" then

        elseif Config.Framework == "LG" then

        end
    end

    self.Coords = function()
        local entity = GetPlayerPed(src)
        if not entity then return end
        local coords, heading = GetEntityCoords(entity), GetEntityHeading(entity)
        return { x = coords.x, y = coords.y, z = coords.z, w = heading }
    end

    return self
end

function Core.SetSotcietyMoney(society, ammount)
    if Config.Framework == "esx" then
        TriggerEvent('esx_addonaccount:getSharedAccount', society, function(account)
            account.addMoney(ammount)
        end)
    elseif Config.Framework == "qb" then

    elseif Config.Framework == "standalone" then
        return true
    elseif Config.Framework == "ox" then

    elseif Config.Framework == "LG" then

    end
end

-- StandAlone uses the same table as ESX
local query = {
    ['esx'] = {
        queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 = 'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? ',
    },

    ['ox'] = {

    },

    ['qb'] = {

    }
}

Querys = query[Config.Framework] == 'standalone' and query['esx'] or query[Config.Framework]
