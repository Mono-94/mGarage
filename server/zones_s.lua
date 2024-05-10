MySQL.query([[
    CREATE TABLE IF NOT EXISTS `mgarages` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(50) NOT NULL,
        `owner` varchar(60) DEFAULT NULL,
        `garage` longtext DEFAULT NULL,
        PRIMARY KEY (`id`)
    )
]])


lib.callback.register('mGarage:GarageZones', function(source, action, data)
    if action == 'getZones' then
        return MySQL.query.await('SELECT * FROM mgarages')
    end
    
    local player = Core.Player(source)

    if player.isAdmin then
        if action == 'create' then
            local zonaExist = MySQL.scalar.await('SELECT * FROM mgarages WHERE name = ?', { data.name })
            if zonaExist then
                return false, lib.print.error('Duplicated Garage name'),
                    TriggerClientEvent('mGarage:notify', source, {
                        title = Text[Config.Lang].GarageCreate1,
                        icon = 'database',
                        description = (Text[Config.Lang].GarageCreate4):format(data.name),
                        type = 'error',
                    })
            end

            data.id = MySQL.insert.await('INSERT INTO mgarages (name, garage) VALUES (?,?)',
                { data.name, json.encode(data) })

            if data.id then
                TriggerClientEvent('mGarage:notify', source, {
                    title = Text[Config.Lang].GarageCreate1,
                    icon = 'database',
                    description = (Text[Config.Lang].GarageCreate5):format(data.name),
                    type = 'success',
                })
                TriggerClientEvent('mGarage:Zone', -1, 'add', data)
            end
            return data.id
        elseif action == 'delete' then
            local db = MySQL.update.await('DELETE FROM mgarages WHERE id = ?', { data.id })
            if db then
                TriggerClientEvent('mGarage:notify', source, {
                    title = Text[Config.Lang].GarageCreate2,
                    icon = 'database',
                    description = (Text[Config.Lang].GarageCreate6):format(data.name),
                    type = 'success',
                })
                TriggerClientEvent('mGarage:Zone', -1, 'delete', data.id)
            end
            return db
        elseif action == 'update' then
            local db = MySQL.update.await('UPDATE mgarages SET garage = ? WHERE id = ?', { json.encode(data), data.id })
            if db then
                TriggerClientEvent('mGarage:notify', source, {
                    title = Text[Config.Lang].GarageCreate3,
                    icon = 'database',
                    description = (Text[Config.Lang].GarageCreate7):format(data.name),
                    type = 'success',
                })
                TriggerClientEvent('mGarage:Zone', -1, 'update', data)
            end
            return db
        end
    else
        return false
    end
end)


lib.addCommand('mgarage', {
    help = '[ mGarage ] Create | Edit  GARAGES',
    restricted = 'group.admin'
}, function(source, args, raw)
    local Player = Core.Player(source)
    if not Player.isAdmin then return end
    lib.callback('mGarage:OpenAdmins', source)
end)
