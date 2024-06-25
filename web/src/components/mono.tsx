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

const VisibilityButtons: React.FC<VisibilityButtonsProps> = ({ handleShowGarage, handleShowMenu, handleShowBuy, handleShowPrivates,handleShowTooltip, garageVisible, menuVisible, buyVisible, privatesVisible, privatesTooltip }) => {
  return (
    <Paper className={` ${isEnvBrowser() ? 'slide-in' : 'slide-out'}`} style={{ display: 'flex', width: 'fit-content', height: 'auto', backgroundColor: '#1A1B1E', borderRadius: 10, padding: 10, margin: 10 }}>
      <Stack  >
        <Button size='md'compact variant="light" color={garageVisible ? 'teal' : ''} onClick={handleShowGarage}>Show Garage</Button>
        <Button size='md'compact variant="light" color={menuVisible ? 'teal' : ''} onClick={handleShowMenu}>Show Menu</Button>
        <Button size='md'compact variant="light" color={buyVisible ? 'teal' : ''} onClick={handleShowBuy}>Show Buy</Button>
        <Button size='md'compact variant="light" color={privatesVisible ? 'teal' : ''} onClick={handleShowPrivates}>Show Private Menu</Button>
        <Button size='md'compact variant="light" color={privatesTooltip ? 'teal' : ''} onClick={handleShowTooltip}>Show Private Menu</Button>
      </Stack>
    </Paper>
  );
};

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
          "infoimpound": "{\"endPound\":\"2024-05-09 01:00\",\"date\":\"2024/05/09 00:24\",\"price\":100,\"reason\":\"asdasad asda sadasd \"}",
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
          "isOwner": false,
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


export default VisibilityButtons;
