# mGarage

* Create garages/impounds in-game or in the configuration
* Garage action: Target/TextUI
* Multilanguage
* Garages for jobs
* Vehicle search in the garage interface
* Custom vehicle garages
* Mark vehicles outside the garage
* Share vehicles with companions
* Save vehicles with fake license plates (using the 'fakeplate' item from mVehicle)
* Impound with societies
* Functions to integrate the garage into any housing system
* Function to impound vehicles




## Functions 


### CarTypes
1. 'automobile'
2. 'bicycle'
3. 'bike'
4. 'blimp'
5. 'boat'
6. 'heli'
7. 'plane'
8. 'quadbike'
9. 'submarine'
10. 'submarinecar'
11. 'trailer'
12. 'train'
13. 'amphibious_quadbike'
14. 'amphibious_automobile'

### OpenGarage
* **exports.mGarage:OpenGarage()**

```lua

exports.mGarage:OpenGarage({
    name = 'GARAGE ID/NAME',
    garagetype = 'garage',              
    intocar = true,                     
    carType = { 'automobile', 'bike' }, 
    spawnpos = {  vec4(0, 0, 0, 0) }
})
```
 
### SaveCar 
* **exports.mGarage:SaveCar()**
```lua
    exports.mGarage:SaveCar({
        name = 'GARAGE ID/NAME',
        garagetype = 'garage',              
        entity = vehicleEntity or false to getVehiclePedIsIn,            
        carType = { 'automobile', 'bike' }, 
    })
```

### impound Vehicle
```lua
    exports.mGarage:ImpoundVehicle({ 
        vehicle = Vehicle entity, 
        impoundName = 'Impound Name' 
    })

```

### Example 
```lua
RegisterCommand('mGarage:opengarage', function(source, args, raw)
    local ped = PlayerPedId()
    local coords, heading = GetEntityCoords(ped), GetEntityHeading(ped)
    exports.mGarage:OpenGarage({
        name = 'Pillbox Hill',
        garagetype = 'garage',              
        intocar = true,                     
        carType = { 'automobile', 'bike' }, 
        spawnpos = {
            vec4(coords.x, coords.y, coords.z, heading),
        }
    })
end)

RegisterCommand('mGarage:savecar', function(source, args, raw)
    local ped = PlayerPedId()
    local vehicleEntity = GetVehiclePedIsIn(ped, false)
    if DoesEntityExist(vehicleEntity) then
        exports.mGarage:SaveCar({
            name = 'Pillbox Hill',
            garagetype = 'garage',             
            entity = vehicleEntity,             
            carType = { 'automobile', 'bike' }, 
        })
    else
        print('No Vehicle')
    end
end)

RegisterCommand('mGarage:impound', function(source, args, raw)
    local ped = PlayerPedId()
    local vehicleEntity = GetVehiclePedIsIn(ped, false)
    if DoesEntityExist(vehicleEntity) then
     ImpoundVehicle({
        vehicle = vehicleEntity,
        impoundName = 'Impound'
    })
    else
        print('No Vehicle')
    end
end)
```
