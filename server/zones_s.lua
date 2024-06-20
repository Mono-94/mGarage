MySQL.query([[
    CREATE TABLE IF NOT EXISTS `mgarages` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(50) NOT NULL,
        `owner` varchar(60) DEFAULT NULL,
        `garage` longtext DEFAULT NULL,
        PRIMARY KEY (`id`)
    )
]])

local QueryZone = {
    Exist = 'SELECT * FROM mgarages WHERE name = ?',
    AddNew = 'INSERT INTO mgarages (name, garage) VALUES (?, ?)',
    Delete = 'DELETE FROM mgarages WHERE id = ?',
    Update = 'UPDATE mgarages SET garage = ? WHERE id = ?'
}


lib.callback.register('mGarage:GarageZones', function(source, action, data)
    if action == 'getZones' then
        return MySQL.query.await('SELECT * FROM mgarages')
    end

    local player = Core.Player(source)

    if player.isAdmin() then
        if action == 'create' then
            local zonaExist = MySQL.scalar.await(QueryZone.Exist, { data.name })
            if zonaExist then
                return false, lib.print.error('Duplicated Garage name'),
                    player.Notify({ title = locale('GarageCreate1'), icon = 'database', description = locale('GarageCreate4',data.name), type = 'error' })
            end

            data.id = MySQL.insert.await(QueryZone.AddNew, { data.name, json.encode(data) })

            if data.id then
                player.Notify({ title = locale('GarageCreate1'), icon = 'database', description = locale('GarageCreate5', data.name), type = 'success' })

                TriggerClientEvent('mGarage:Zone', -1, 'add', data)
            end
            return data.id
        elseif action == 'delete' then
            local db = MySQL.update.await(QueryZone.Delete, { data.id })
            if db then
                player.Notify({
                    title = locale('GarageCreate2'),
                    icon = 'database',
                    description = locale('GarageCreate6',data.name),
                    type = 'success' })
                TriggerClientEvent('mGarage:Zone', -1, 'delete', data.id)
            end
            return db
        elseif action == 'update' then
            local db = MySQL.update.await(QueryZone.Update, { json.encode(data), data.id })
            if db then
                player.Notify({ title = locale('GarageCreate3'), icon = 'database', description = locale('GarageCreate7', data.name), type = 'success' })
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
    lib.callback('mGarage:OpenAdmins', source, function ()
        
    end)
end)
