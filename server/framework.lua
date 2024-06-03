Core = {}

if Config.Framework == "esx" then
    Core.shared = exports["es_extended"]:getSharedObject()
elseif Config.Framework == "ox" then
    Core.shared = require '@ox_core.lib.init'
elseif Config.FrameWork == "qb" then
    Core.shared = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "LG" then
    Core.shared = exports['LegacyFramework']:ReturnFramework()
end

function Core.Player(src)
    local self = {}

    self.clientEvent = function(name, ...)
        TriggerClientEvent(name, src, ...)
    end

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
        elseif Config.Framework == "qbox" then
            local Player = exports.qbx_core:GetPlayer(src)
            if Player then
                return Player.PlayerData.license
            end
        elseif Config.Framework == "standalone" then
            return GetPlayerIdentifierByType(src, 'license')
        elseif Config.Framework == "ox" then
            local player = Core.shared.GetPlayer(src)
            if player then
                return player.charId
            end
        elseif Config.Framework == "LG" then
            local playerData = Core.shared.SvPlayerFunctions.GetPlayerData(src)[1]
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
        elseif Config.Framework == "qbox" then
            local Player = exports.qbx_core:GetPlayer(src)
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
            local playerData = Core.shared.SvPlayerFunctions.GetPlayerData(src)[1]
            if playerData then
                return playerData.firstName .. '' .. playerData.lastName
            end
        end
        return false
    end

    self.getMoney = function(account)
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            local money = Player.getAccount(account)
            return { money = money.money }
        elseif Config.Framework == "qb" then
            return true
        elseif Config.Framework == "qbox" then
            local Player = exports.qbx_core:GetPlayer(src)
            if Player then
                if account == 'money' then account = 'cash' end
                local money = Player.Functions.GetMoney(account)
                return { money = money }
            end
        elseif Config.Framework == "standalone" then
            return true
        elseif Config.Framework == "ox" then
            return true
        elseif Config.Framework == "LG" then
            local playerData = Core.shared.SvPlayerFunctions.GetPlayerData(src)[1]
            local moneyAccounts = json.decode(playerData.moneyAccounts)
            return { money = moneyAccounts.money }
        end
    end

    self.RemoveMoney = function(account, amount)
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            return Player.removeAccountMoney(account, amount)
        elseif Config.Framework == "qb" then
            return true
        elseif Config.Framework == "qbox" then
            local Player = exports.qbx_core:GetPlayer(src)
            if Player then
                if account == 'money' then account = 'cash' end
                return Player.Functions.RemoveMoney(account, amount, 'Garage')
            end
        elseif Config.Framework == "standalone" then
            return true
        elseif Config.Framework == "ox" then
            return true
        elseif Config.Framework == "LG" then
            return Core.shared.SvPlayerFunctions.RemovePlayerMoneyCash(account, amount)
        end
    end

    self.isAdmin = function()
        if Config.Framework == "esx" then
            local Player = Core.shared.GetPlayerFromId(src)
            return (Player.getGroup() == 'admin')
        elseif Config.Framework == "qb" then
            return true
        elseif Config.Framework == "qbox" then
            --  local Player = exports.qbx_core:GetPlayer(src)
            --  if Player then
            --      if account == 'money' then
            --          account = 'cash'
            --      end
            --      return Player.Functions.RemoveMoney(account, amount, 'Garage')
            --  end
            return true
        elseif Config.Framework == "standalone" then
            return true
        elseif Config.Framework == "ox" then
            return true
        elseif Config.Framework == "LG" then
            return Core.shared.SvPlayerFunctions.GetPlayerGroup(src)
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
            local job = Core.shared.GetPlayerFromId(src).getJob()
            return { name = job.name, grade = job.grade, gradeName = job.grade_name }
        elseif Config.Framework == "qbox" then
            local Player = exports.qbx_core:GetPlayer(src)
            if Player then
                local job = Player.PlayerData.job.name
                local grade = Player.PlayerData.job.grade.level
                local grade_name = Player.PlayerData.job.grade.name
                print(job, grade, grade_name)
                return { name = job, grade = tonumber(grade), gradeName = grade_name }
            end
        elseif Config.Framework == "qb" then
            return true
        elseif Config.Framework == "standalone" then
            return true
        elseif Config.Framework == "ox" then
            return true
        elseif Config.Framework == "LG" then
            local PlayerData = Core.SvPlayerFunctions.GetPlayerData(src)[1]
            return { name = PlayerData.nameJob, grade = PlayerData.gradeJob }
        end
        return false
    end

    return self
end

function Core.SetSotcietyMoney(society, ammount)
    if Config.Framework == "esx" then
        TriggerEvent('esx_addonaccount:getSharedAccount', society, function(account)
            account.addMoney(ammount)
        end)
    elseif Config.Framework == "qbox" then

    elseif Config.Framework == "qb" then

    elseif Config.Framework == "standalone" then
        return true
    elseif Config.Framework == "ox" then

    elseif Config.Framework == "LG" then
        return exports.LGF_Society:UpdateSocietyFounds(society, ammount)
    end
end

-- StandAlone uses the same table as ESX

local query = {
    ['esx'] = {
        queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? ',
        queryImpound =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, metadata = ? WHERE `plate` = ?'
    },

    ['qbox'] = {
        queryStore1 = 'SELECT `license`, `keys` FROM `player_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 = 'UPDATE `player_vehicles` SET `garage` = ?, `stored` = 1, `mods` = ?, type = ? WHERE `plate` = ? ',
        queryImpound =
        'UPDATE `player_vehicles` SET `garage` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, metadata = ? WHERE `plate` = ?'
    },

    ['ox'] = {

    },

    ['qb'] = {

    },

    ['standalone'] = {
        queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? ',
        queryImpound =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, metadata = ? WHERE `plate` = ?'
    },

    ['LG'] = {
        queryStore1 = 'SELECT `owner`, `keys` FROM `owned_vehicles` WHERE `plate` = ? LIMIT 1',
        queryStore2 =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 1, `vehicle` = ?, type = ? WHERE `plate` = ? ',
        queryImpound =
        'UPDATE `owned_vehicles` SET `parking` = ?, `stored` = 0, `pound` = 1, `coords` = NULL, metadata = ? WHERE `plate` = ?'
    },
}

Querys = query[Config.Framework]
