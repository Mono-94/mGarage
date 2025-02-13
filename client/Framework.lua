Core = {}


function Core:GetPlayerJob()
    if Config.Framework == "esx" then
        local Job = LocalPlayer.state.job
        return { name = Job.name, grade = Job.grade, gradeName = Job.grade_name }
    elseif Config.Framework == "standalone" then
        -- Your custom logic for standalone framework
        return { name = '', grade = '', gradeName = '' }
    end
end

function Core:PlayerGroup()
    if Config.Framework == "esx" then
        return LocalPlayer.state.group
    elseif Config.Framework == "standalone" then
        -- Your custom logic for standalone framework
        return true
    end
end
