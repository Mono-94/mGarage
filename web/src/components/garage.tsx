// Garage.tsx
import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { debugData } from "../utils/debugData";
import SearchBox from "./lit/search";
import { Accordion, CloseButton, Paper } from '@mantine/core';
import Vehicles from "./vehicle";
import './index.scss'

interface GarageData {
    name: string;
}

const Garage: React.FC = () => {
    const [dataGarage, GarageData] = useState<GarageData>({ name: "" });
    const [vehiclesData, setVehicleData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    useNuiEvent<any>('garage', (data) => {
        GarageData(data.garage);

        if (data.garage.garagetype === 'custom') {
            setVehicleData(data.garage.defaultCars);
        } else {
            setVehicleData(data.vehicles);
        }
    });


    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
    };

    const filteredVehicles = vehiclesData.filter((vehicle) =>
        (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vehicle.vehlabel && vehicle.vehlabel.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="Garage">

            <Paper className="Garage-head"  withBorder>
                <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <span>{dataGarage.name}</span>
                <CloseButton size="md" onClick={handleClose} color="red" />
            </Paper>
            <div className="content">
                <Accordion variant="contained"  transitionDuration={700} style={{ backgroundColor: '#141414', borderRadius:'5px' }} >
                    {filteredVehicles.map((vehicle, index) => (
                        <Vehicles
                            key={index}
                            index={index}
                            vehicle={vehicle}
                            garage={dataGarage}
                        />
                    ))}
                </Accordion>

            </div>
        </div>
    );
};

export default Garage;

debugData([
    {
        action: "setVisibleGarage",
        data: false,
    },
  
    {
        action: "setVisibleMenu",
        data: true,
    },
    {
        action: "GarageZones",
        data: [
            {
                "garagetype": "impound",
                "priceImpound": 110,
                "defaultCars": false,
                "intocar": false,
                "zoneType": "target",
                "npchash": "csb_trafficwarden",
                "defaultImpound": [
                    "LSPD Impound"
                ],
                "blip": true,
                "carType": [],
                "debug": true,
                "default": false,
                "name": "Test Impound"
            },
            {
                "garagetype": "garage",
                "priceImpound": 110,
                "defaultCars": false,
                "intocar": false,
                "zoneType": "target",
                "npchash": "csb_trafficwarden",
                "defaultImpound": [
                    "LSPD Impound"
                ],
                "blip": true,
                "carType": [],
                "debug": true,
                "default": false,
                "name": "Test Garage"
            },
        ]
    },
    {
        action: "garage",
        data: {
            "garage": {
                "name": "mGarage",
                "blip": true,
                "actioncoords": { "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 },
                "carType": [ "automobile", "bike" ],
                "thickness": 4,
                "blipEntity": 25493518,
                "spawnpos": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 } ],
                "TargetId": 2,
                "points": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 } ],
                "priceImpound": 232,
                "garagetype": "garage",
                "intocar": false,
                "npchash": "csb_trafficwarden",
                "debug": false,
                "npcEntity": 2879490,
                "defaultCars": false,
                "id": 2,
                "isShared": false,
                "zoneType": "target",
                "job": false
            },
            "vehicles": [
                {
                    "isOwner": true,
                    "infoimpound": "{\"date\":\"2024-04-11 21:03:45\",\"reason\":\"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ad similique incidunt praesentium voluptatem quam. Quae odit est perferendis soluta eum modi. In, corporis quod cum quis quaerat laborum quasi.\",\"price\":10}",
                    "pound": 1,
                    "seats": 4,
                    "stored": 0,
                    "vehlabel": 'Karin Sultan',
                    "plate": "MONO 363",
                    "mileage": 3424.2,
                    "id": 8,
                    "parking": "Impound",
                    "ownername": "Mono Test",
                    "engineHealth": 90,
                    "fuelLevel": 1,
                    "bodyHealth": 82,
                },
                {
                    "isOwner": true,
                    "infoimpound": "{\"date\":\"2024-04-11 21:03:45\",\"reason\":\"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ad similique incidunt praesentium voluptatem quam. Quae odit est perferendis soluta eum modi. In, corporis quod cum quis quaerat laborum quasi.\",\"price\":10}",
                    "pound": 1,
                    "seats": 4,
                    "stored": 0,
                    "vehlabel": 'Karin Sultan',
                    "plate": "MONO 735s",
                    "mileage": 6534.24,
                    "id": 8,
                    "parking": "Impound",
                    "ownername": "Mono Test",
                    "engineHealth": 90,
                    "fuelLevel": 1,
                    "bodyHealth": 82,
                },
                {
                    "isOwner": false,
                    "infoimpound": "{\"date\":\"2024-04-11 21:03:45\",\"reason\":\"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ad similique incidunt praesentium voluptatem quam. Quae odit est perferendis soluta eum modi. In, corporis quod cum quis quaerat laborum quasi.\",\"price\":10}",
                    "pound": 1,
                    "seats": 4,
                    "stored": 0,
                    "vehlabel": 'Karin Sultan',
                    "plate": "MONO 420",
                    "mileage": 12.32,
                    "id": 8,
                    "parking": "Impound",
                    "ownername": "Mono Test",
                    "engineHealth": 34,
                    "fuelLevel": 68,
                    "bodyHealth": 82,
                },
            ]
        },
    },

], 100);
