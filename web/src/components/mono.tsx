import React from 'react';
import { Button, Paper, Stack } from '@mantine/core';
import { isEnvBrowser } from '../utils/misc';
import { debugData } from '../utils/debugData';

interface VisibilityButtonsProps {
  handleShowGarage: () => void;
  handleShowMenu: () => void;
  handleShowBuy: () => void;
  handleShowPrivates: () => void;
  handleShowTooltip: () => void;
  garageVisible: boolean;
  menuVisible: boolean;
  buyVisible: boolean;
  privatesVisible: boolean;
  privatesTooltip: boolean;
}

const VisibilityButtons: React.FC<VisibilityButtonsProps> = ({ handleShowGarage, handleShowMenu, handleShowBuy, handleShowPrivates, handleShowTooltip, garageVisible, menuVisible, buyVisible, privatesVisible, privatesTooltip }) => {
  return (
    <Paper className={` ${isEnvBrowser() ? 'slide-in' : 'slide-out'}`} style={{ display: 'flex', width: 'fit-content', height: 'auto', backgroundColor: '#1A1B1E', borderRadius: 10, padding: 10, margin: 10, gap: 10, top: 0, position: 'fixed' }}>

      <Button size='md' compact variant="light" color={garageVisible ? 'teal' : ''} onClick={handleShowGarage}>Show Garage</Button>
      <Button size='md' compact variant="light" color={menuVisible ? 'teal' : ''} onClick={handleShowMenu}>Show Menu</Button>
      <Button size='md' compact variant="light" color={buyVisible ? 'teal' : ''} onClick={handleShowBuy}>Show Buy</Button>
      <Button size='md' compact variant="light" color={privatesVisible ? 'teal' : ''} onClick={handleShowPrivates}>Show Private Menu</Button>
      <Button size='md' compact variant="light" color={privatesTooltip ? 'teal' : ''} onClick={handleShowTooltip}>Show Vehicle Tooltip</Button>

    </Paper>
  );
};

const garageType = 'garage'; // 'custom'  | 'garage' | 'impound'
const garageName = 'Pillbox Hill' // 'Pillbox Hill' = garage | 'LSPD' = custom | 'Impound' = impound

debugData([
  {
    action: 'setVisibleGarage',
    data: false
  },
  {
    action: 'setVisibleMenu',
    data: false
  },
  {
    action: 'setVisibleBuy',
    data: false
  },
  {
    action: 'setVisiblePrivates',
    data: false
  },
  {
    action: 'setVisibleTooltip',
    data: false
  },
  {
    action: 'minimizeMenu',
    data: {
      minimized: false,
      action: 'zone'
    }
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
        "prop":true,
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
        "prop":true,
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
        "prop":true,
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
        "name": garageName,
        "blip": true,
        "actioncoords": { "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 },
        "carType": ["automobile", "bike"],
        "thickness": 4,
        "blipEntity": 25493518,
        "spawnpos": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
        "TargetId": 2,
        "points": [{ "w": 0.0, "z": 0.0, "y": 0.0, "x": 0.0 }],
        "priceImpound": 232,
        "garagetype": garageType,
        "intocar": false,
        "npchash": "csb_trafficwarden",
        "debug": false,
        "npcEntity": 2879490,
        "defaultCars": [
          { "model": 'sultan', "vehlabel": 'Sultan Karin1' },
          { "model": 't20', "vehlabel": 'Sultan Karin' },
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
          "model": "police",
          "vehlabel": " Police",
          "parking": "LSPD",
          "grades": [1, 2, 3, 4]
        },
        {
          "model": "police2",
          "vehlabel": " Police2",
          "parking": "LSPD",
          "grades": ["boss"]
        },

        {
          "vehlabel": "Bravado Banshee3",
          "vehicle": "{\"modCustomTiresR\":false,\"modSubwoofer\":-1,\"interiorColor\":93,\"modEngine\":-1,\"dirtLevel\":2,\"modExhaust\":-1,\"engineHealth\":945,\"modShifterLeavers\":-1,\"wheels\":0,\"tankHealth\":993,\"modCustomTiresF\":false,\"neonEnabled\":[false,false,false,false],\"bodyHealth\":942,\"modRightFender\":-1,\"modAPlate\":-1,\"modSeats\":-1,\"modAerials\":-1,\"model\":-660007725,\"paintType1\":7,\"modSteeringWheel\":-1,\"modSpoilers\":-1,\"modTrimA\":-1,\"modFrontBumper\":-1,\"doors\":[],\"color1\":64,\"oilLevel\":5,\"modFrontWheels\":-1,\"modWindows\":-1,\"modRoofLivery\":-1,\"modVanityPlate\":-1,\"xenonColor\":255,\"wheelSize\":1.0,\"modBackWheels\":-1,\"modLivery\":-1,\"paintType2\":7,\"modFender\":-1,\"modSuspension\":-1,\"modHorns\":-1,\"plateIndex\":0,\"modEngineBlock\":-1,\"bulletProofTyres\":true,\"modTurbo\":false,\"modHydrolic\":-1,\"windows\":[2,3,4,5],\"modAirFilter\":-1,\"modRoof\":-1,\"driftTyres\":false,\"windowTint\":-1,\"modHood\":-1,\"extras\":[],\"modRearBumper\":-1,\"wheelWidth\":1.0,\"modXenon\":false,\"modHydraulics\":false,\"modPlateHolder\":-1,\"modBrakes\":-1,\"modTransmission\":-1,\"wheelColor\":0,\"modArchCover\":-1,\"modTrimB\":-1,\"color2\":64,\"modTrunk\":-1,\"dashboardColor\":134,\"modGrille\":-1,\"tyres\":[],\"livery\":-1,\"modSpeakers\":-1,\"modDoorSpeaker\":-1,\"fuelLevel\":62,\"neonColor\":[255,0,255],\"tyreSmokeColor\":[255,255,255],\"modOrnaments\":-1,\"modDoorR\":-1,\"pearlescentColor\":73,\"modSmokeEnabled\":false,\"modDashboard\":-1,\"plate\":\"KDAI JC6\",\"modFrame\":-1,\"modStruts\":-1,\"modSideSkirt\":-1,\"modArmor\":-1,\"modNitrous\":-1,\"modDial\":-1,\"modLightbar\":-1,\"modTank\":-1}",
          "stored": 1,
          "seats": 2,
          "carseller": 0,
          "metadata": {
            "firstSpawn": "2025/02/02 01:05:12",
            "DoorStatus": 0,
            "fisrtOwner": "Test Test"
          },
          "engineHealth": 94.2,
          "keys": "[]",
          "bodyHealth": 94.5,
          "owner": "char1:559586a641fc2fbf1077189e89cd24ad50b43f01",
          "type": "automobile",
          "imagelink": "https://docs.fivem.net/vehicles/banshee3.webp",
          "plate": "KDAI JC6",
          "vehlabel_original": "Bravado Banshee3",
          "parking": "Pillbox Hill",
          "mileage": 1.29,
          "private": false,
          "lastparking": "Pillbox Hill",
          "isOwner": true,
          "fuelLevel": 10,
          "id": 12
        },
        {
          "vehlabel": "Progen T20",
          "vehicle": "{\"modCustomTiresR\":false,\"modSubwoofer\":-1,\"interiorColor\":0,\"modEngine\":3,\"dirtLevel\":1,\"modExhaust\":-1,\"engineHealth\":981,\"modShifterLeavers\":-1,\"wheels\":7,\"tankHealth\":980,\"modCustomTiresF\":false,\"neonEnabled\":[false,false,false,false],\"bodyHealth\":840,\"modRightFender\":-1,\"modAPlate\":-1,\"modSeats\":-1,\"modAerials\":-1,\"model\":1663218586,\"paintType1\":7,\"modSteeringWheel\":-1,\"modSpoilers\":-1,\"modTrimA\":-1,\"modFrontBumper\":-1,\"doors\":[],\"color1\":7,\"oilLevel\":5,\"modFrontWheels\":-1,\"modWindows\":-1,\"modRoofLivery\":-1,\"modVanityPlate\":-1,\"xenonColor\":255,\"wheelSize\":1.0,\"modBackWheels\":-1,\"modLivery\":-1,\"paintType2\":7,\"modFender\":-1,\"modSuspension\":-1,\"modHorns\":-1,\"plateIndex\":0,\"modEngineBlock\":-1,\"bulletProofTyres\":true,\"modTurbo\":true,\"modHydrolic\":-1,\"windows\":[2,3,4,5],\"modAirFilter\":-1,\"modRoof\":-1,\"driftTyres\":false,\"windowTint\":-1,\"modHood\":-1,\"extras\":[],\"modRearBumper\":-1,\"wheelWidth\":1.0,\"modXenon\":false,\"modHydraulics\":false,\"modPlateHolder\":-1,\"modBrakes\":2,\"modTransmission\":2,\"wheelColor\":0,\"modArchCover\":-1,\"modTrimB\":-1,\"color2\":7,\"modTrunk\":-1,\"dashboardColor\":0,\"modGrille\":-1,\"tyres\":[],\"livery\":-1,\"modSpeakers\":-1,\"modDoorSpeaker\":-1,\"fuelLevel\":65,\"neonColor\":[255,0,255],\"tyreSmokeColor\":[255,255,255],\"modOrnaments\":-1,\"modDoorR\":-1,\"pearlescentColor\":3,\"modSmokeEnabled\":false,\"modDashboard\":-1,\"plate\":\"1871 F13\",\"modFrame\":-1,\"modStruts\":-1,\"modSideSkirt\":-1,\"modArmor\":4,\"modNitrous\":-1,\"modDial\":-1,\"modLightbar\":-1,\"modTank\":-1}",
          "pound": "1",
          "stored": 0,
          "seats": 2,
          "carseller": 0,
          "metadata": {
            "firstSpawn": "2025/02/01 05:25:30",
            "fisrtOwner": "Test Test",
            "DoorStatus": 0,
            "pound": {
              "price": 50,
              "reason": "Vehicle seized by the municipal service",
              "date": "2025/02/06 19:30"
            }
          },
          "engineHealth": 84.0,
          "keys": "[]",
          "bodyHealth": 98.1,
          "owner": "char1:559586a641fc2fbf1077189e89cd24ad50b43f01",
          "infoimpound": "{\"price\":50,\"reason\":\"Vehicle seized by the municipal service\",\"date\":\"2025/02/06 19:30\"}",
          "type": "automobile",
          "imagelink": "https://docs.fivem.net/vehicles/t20.webp",
          "plate": "1871 F13",
          "parking": "Impound Car",
          "isOwner": true,
          "vehlabel_original": "Progen T20",
          "private": false,
          "lastparking": "Pillbox Hill",
          "mileage": 9.41,
          "fuelLevel": 65,
          "id": 11
        },
      ]
    },
  },

], 100);


export default VisibilityButtons;
