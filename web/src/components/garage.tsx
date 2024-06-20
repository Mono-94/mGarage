import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { debugData } from "../utils/debugData";
import SearchBox from "./lit/search";
import { Accordion, Center, CloseButton, ScrollArea, createStyles, rem } from '@mantine/core';
import Vehicles from "./vehicle";
import './index.scss'


const useStyles = createStyles((theme) => ({
    root: {
        padding: 0,
    },

    item: {
        padding: 5,
        backgroundColor: '#1A1B1E',
        borderRadius: 10,
        marginBottom: '5px',

        '&[data-active]': {
            backgroundColor: '#1A1B1E',
        },
    },

    content: {
        padding: 0
    },

    label: {
        padding: 7,
    },

    chevron: {
        '&[data-rotate]': {
            transform: 'rotate(-90deg)',

        },
    },
}));


const Garage: React.FC<{ visible: boolean }> = ({ visible }) => {

    const [dataGarage, GarageData] = useState<any>({});
    const [vehiclesData, setVehicleData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    useNuiEvent<any>('garage', (data) => {
        GarageData(data.garage);
        setVehicleData(data.vehicles);
    });


    const handleClose = async () => {
        setActiveAccordion(null);
        fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
    };

    const filteredVehicles = vehiclesData.filter((vehicle) =>
        (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vehicle.vehlabel && vehicle.vehlabel.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const { classes } = useStyles();
    return (

        <div className={`Garage ${visible ? 'slide-in' : 'slide-out'}`}>

            <div className="Garage-head">
                <div className="name">{dataGarage.name}</div>
                <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <CloseButton radius={10} size={'md'} onClick={handleClose} color="red" variant="light" />
            </div>

            <ScrollArea mah={440} scrollbarSize={0}>
                {filteredVehicles.length > 0 ? (
                    <Accordion
                        variant="filled"
                        defaultValue="customization"
                        classNames={classes}
                        className={classes.root}
                        transitionDuration={500}
                        mah={490}
                        value={activeAccordion}
                        onChange={setActiveAccordion}

                    >
                        {filteredVehicles.map((vehicle, index) => (
                            <Vehicles
                                key={index}
                                index={index}
                                vehicle={vehicle}
                                garage={dataGarage}
                                Close={handleClose}

                            />
                        ))}
                    </Accordion>
                ) : (
                    <Center h={100} mx="auto" sx={{ backgroundColor: '#1A1B1E' }}>
                        <div>😢</div>
                    </Center>
                )}
            </ScrollArea>

        </div >
    );
};

export default Garage;

debugData([
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
                "garagetype": "impound",
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
            ]
        },
    },

], 100);
