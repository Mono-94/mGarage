import React, { useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Group, Paper } from '@mantine/core';
import { debugData } from '../../utils/debugData';
import ProgressBar from '../lit/progress';
import { IconCarCrash, IconEngine, IconGasStation, IconTool } from '@tabler/icons-react';
import Lang from '../../utils/LangR';

debugData([
    {
        action: 'tooltipCoords',
        data: {
            x: 500,
            y: 400
        }
    },
    {
        action: 'tooltipVehicle',
        data: {
            "displayname": "DOMINATO2",
            "make": "VAPID",
            "engineHealth": 99.9,
            "bodyHealth": 99.8,
            "turbo": false,
            "transmission": -1,
            "brakes": -1,
            "seats": 2,
            "fuelLevel": 100.0,
            "model": -915704871,
            "engine": 0,
            "suspension": -1,
            "maxSpeed": 180
        }
    }
], 100);

const VehicleToolTip: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [vehicleData, setVehicleData] = useState<any>(null);
    const lang = Lang();

    useNuiEvent<any>('tooltipCoords', (data) => {
        setPosition({ x: data.x, y: data.y });
    });

    useNuiEvent<any>('tooltipVehicle', (data) => {
        setVehicleData(data);
    });

    const renderPartStatus = (partName: string, status: number) => {
        return status === -1 ? (
            <div>{partName}: {'None'}</div>
        ) : (
            <div>{partName}: {status}</div>
        );
    };

    return (
        <Paper p={10} radius={10} style={{ position: 'fixed', left: position.x, top: position.y, display: visible ? 'block' : 'none' }}>
            {vehicleData ? (
                <div>
                    <Group position="center">
                        <ProgressBar value={vehicleData.fuelLevel} text={lang.GarageMenu9} icon={<IconGasStation size={17} />} />
                        <ProgressBar value={vehicleData.engineHealth} text={lang.GarageMenu10} icon={<IconEngine size={17} />} />
                        <ProgressBar value={vehicleData.bodyHealth} text={lang.GarageMenu11} icon={<IconCarCrash size={17} />} />
                    </Group>
                    <div>Marca: {vehicleData.make}</div>
                    <div>Velocidad Máxima: {vehicleData.maxSpeed} km/h</div>
                    <div>Asientos: {vehicleData.seats}</div>
                    {renderPartStatus('Transmisión', vehicleData.transmission)}
                    {renderPartStatus('Frenos', vehicleData.brakes)}
                    {renderPartStatus('Motor', vehicleData.engine)}
                    {renderPartStatus('Suspensión', vehicleData.suspension)}

                </div>
            ) : (
                <div>Loading...</div>
            )}
        </Paper>
    );
};

export default VehicleToolTip;
