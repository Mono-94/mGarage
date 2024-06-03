import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { debugData } from "../utils/debugData";
import SearchBox from "./lit/search";
import { Accordion, Center, CloseButton } from '@mantine/core';
import Vehicles from "./vehicle";
import './index.scss'


const Garage: React.FC = () => {
    const [dataGarage, GarageData] = useState<any>({});
    const [vehiclesData, setVehicleData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useNuiEvent<any>('garage', (data) => {
        GarageData(data.garage);
        setVehicleData(data.vehicles);
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
            <div className="Garage-head">
                <div className="overflow-ellipsis">{dataGarage.name}</div>
                <div style={{ width: 'auto' }}><SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} /></div>
                <div style={{ width: 'auto' }}> <CloseButton size={'md'} onClick={handleClose} color="red" /></div>
            </div>


            <div className="content">
                {filteredVehicles.length > 0 ? (
                    <Accordion variant="separated" transitionDuration={700}
                        styles={{
                            item: {
                                backgroundColor: '#2e3036',
                            },
                            content: {
                                padding: 5,
                            },
                        }}
                    >
                        {filteredVehicles.map((vehicle, index) => (
                            <Vehicles
                                key={index}
                                index={index}
                                vehicle={vehicle}
                                garage={dataGarage}
                            />
                        ))}
                    </Accordion>
                ) : (
                    <Center  h={100} mx="auto">
                        <div>😢</div>
                    </Center>
                )}

            </div>
        </div>
    );
};

export default Garage;

debugData([
    {
        action: "setVisibleGarage",
        data: true
    },
    {
        action: "setVisibleMenu",
        data: false,
    },
    {
        action: "GarageZones",
        data: [
            {
                "garagetype": "garage",
                "priceImpound": 110,
                "defaultCars": false,
                "intocar": false,
                "zoneType": "target",
                "npchash": "csb_trafficwarden",
                "defaultImpound": "LSPD Impound",
                "blip": true,
                "carType": ["automobile", "bike"],
                "debug": true,
                "default": false,
                "name": "Garage",
                "id": 1,
                "job": ''
            },
            {
                "garagetype": "impound",
                "priceImpound": 110,
                "defaultCars": false,
                "intocar": false,
                "zoneType": "target",
                "npchash": "csb_trafficwarden",
                "defaultImpound": "LSPD Impound",
                "blip": true,
                "carType": ["automobile", "bike"],
                "debug": true,
                "default": false,
                "name": "Impound",
                "id": 2,
                "job": ''
            },
            {
                "name": "mGarage",
                "blip": true,
                "actioncoords": { "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 },
                "carType": ["automobile", "bike"],
                "thickness": 4,
                "blipEntity": 25493518,
                "spawnpos": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
                "TargetId": 2,
                "points": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
                "priceImpound": 232,
                "garagetype": "custom",
                "intocar": false,
                "npchash": "csb_trafficwarden",
                "debug": false,
                "npcEntity": 2879490,
                "platePrefix": 'MONO',
                "defaultCars": [
                    { "model": 'sultan', "vehlabel": 'Sultan Karin1', "grades": [1, 2, 3, 4] },
                    { "model": 't20', "price": 200, "vehlabel": 'Sultan Karin' },
                    { "model": 'scarab', "price": 300, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police2', "price": 400, "vehlabel": 'Sultan Karin2' },
                ],
                "id": 3,
                "isShared": false,
                "zoneType": "target",
                "job": ''
            }
        ]
    },
    {
        action: "garage",
        data: {
            "garage": {
                "name": "mGarage",
                "blip": true,
                "actioncoords": { "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 },
                "carType": ["automobile", "bike"],
                "thickness": 4,
                "blipEntity": 25493518,
                "spawnpos": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
                "TargetId": 2,
                "points": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
                "priceImpound": 232,
                "garagetype": "garage",
                "intocar": false,
                "npchash": "csb_trafficwarden",
                "debug": false,
                "npcEntity": 2879490,
                "defaultCars": [
                    { "model": 'sultan', "vehlabel": 'Sultan Karin1' },
                    { "model": 't20', "price": 200, "vehlabel": 'Sultan Karin' },
                    { "model": 'scarab', "price": 300, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police', "price": 400, "vehlabel": 'Sultan Karin' },
                    { "model": 'police2', "price": 400, "vehlabel": 'Sultan Karin2' },
                ],
                "id": 2,
                "isShared": false,
                "zoneType": "target",
                "job": false
            },
            "vehicles": [
                {
                    "isOwner": true,
                    "infoimpound": "{\"endPound\":\"2024-05-09 01:00\",\"date\":\"2024/05/09 00:24\",\"price\":1,\"reason\":\"asdasad asda sadasd \"}",
                    "pound": 1,
                    "seats": 4,
                    "stored": 1,
                    "vehlabel": 'Karin Sultan',
                    "model2": 'sultan',
                    "plate": "MONO 363",
                    "mileage": 3424.2,
                    "id": 8,
                    "parking": "Impound",
                    "ownername": "Mono Test",
                    "engineHealth": 90,
                    "fuelLevel": 1,
                    "bodyHealth": 82,
                    "fakeplate": "BRBRBRBR",
                },
                {
                    "isOwner": true,
                    "infoimpound": "{\"date\":\"2024-04-11 21:03:45\",\"reason\":\"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ad similique incidunt praesentium voluptatem quam. Quae odit est perferendis soluta eum modi. In, corporis quod cum quis quaerat laborum quasi.\",\"price\":10}",
                    "pound": 0,
                    "seats": 4,
                    "stored": 0,
                    "vehlabel": 'Karin Sultan',
                    "model2": 'sultan',
                    "plate": "MONO 735s",
                    "mileage": 6534.24,
                    "id": 8,
                    "parking": "Impound",
                    "ownername": "Mono Test",
                    "engineHealth": 90,
                    "fuelLevel": 1,
                    "bodyHealth": 82,
                    "fakeplate": null,
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
