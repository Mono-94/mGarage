# mGarage



# Functions 



## OpenGarage
* **exports.mGarage:OpenGarage()**

```lua
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
```
 
## SaveCar 
* **exports.mGarage:SaveCar()**
```lua
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
```