ESX, Ox, QBCore = nil, nil, nil

if Config.Framework == "esx" then
    ESX = exports["es_extended"]:getSharedObject()
elseif Config.Framework == "ox" then
    Ox = require '@ox_core.lib.init'
elseif Config.FrameWork == "qb" then
    QBCore = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "LG" then
    LegacyFramework = exports.LegacyFramework:ReturnFramework()
end


function GetJob()
    if Config.Framework == "esx" then
        local job = ESX.PlayerData.job
        return { name = job.name, grade = job.grade }
    elseif Config.Framework == "qb" then

    elseif Config.Framework == "standalone" then
        return true
    elseif Config.Framework == "ox" then

    elseif Config.Framework == "LG" then
    end
    return false
end

