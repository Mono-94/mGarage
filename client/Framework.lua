Core = {}

if Config.Framework == "esx" then
    Core = exports["es_extended"]:getSharedObject()
elseif Config.Framework == "ox" then
    Core = require '@ox_core.lib.init'
elseif Config.FrameWork == "qb" then
    Core = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "LG" then
    Core = exports['LegacyFramework']:ReturnFramework()
end


function GetJob()
    if Config.Framework == "esx" then
        local job = Core.PlayerData.job
        return { name = job.name, grade = job.grade }
    elseif Config.Framework == "qb" then

    elseif Config.Framework == "standalone" then
        return true
    elseif Config.Framework == "ox" then

    elseif Config.Framework == "LG" then
        local PlayerData = Core.PlayerFunctions.GetClientData()[1]
        local Job = PlayerData?.nameJob
        local Grade = PlayerData?.gradeJob
        if not Job or not Grade then
            warn("[^3WARNING^7] Player data not available.")
        end

        return { Job = Job, Grade = Grade }
    end
    return false
end
