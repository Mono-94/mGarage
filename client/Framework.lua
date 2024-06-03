Core = nil



function LoadCore()
    if Config.Framework == "esx" then
        Core = exports["es_extended"]:getSharedObject()
    elseif Config.Framework == "ox" then
        Core = require '@ox_core.lib.init'
    elseif Config.FrameWork == "qb" then
        Core = exports['qb-core']:GetCoreObject()
    elseif Config.Framework == "LG" then
        Core = exports['LegacyFramework']:ReturnFramework()
    elseif Config.Framework == "qbox" then
        Core = exports.qbx_core:GetPlayerData()
    end
end

LoadCore()

function GetJob()
    if Config.Framework == "esx" then
        local job = Core.PlayerData.job
        if not job then
            print('not load?...')
            LoadCore()
            job = Core.PlayerData.job
        end
        return { name = job.name, grade = job.grade }
    elseif Config.Framework == "qb" then

    elseif Config.Framework == "qbox" then
        local name, grade
        for k, v in pairs(Core.jobs) do
            name = k
            grade = v
        end
        return { name = name, grade = grade }
    elseif Config.Framework == "standalone" then
        return true
    elseif Config.Framework == "ox" then

    elseif Config.Framework == "LG" then
        local PlayerData = Core.PlayerFunctions.GetClientData()[1]
        local Job = PlayerData?.nameJob
        local Grade = PlayerData?.gradeJob

        return { name = Job, grade = Grade }
    end
    return false
end
