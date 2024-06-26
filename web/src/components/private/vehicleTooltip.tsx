import React, { useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Button, Group, Paper, Stack, Text } from '@mantine/core';
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
            "engineHealth": 100.0,
            "displayname": "SULTAN",
            "brakes": "Standard Brakes",
            "turbo": "",
            "suspension": "Standard Suspension",
            "bodyHealth": 100.0,
            "maxspeed": 160,
            "seats": 4,
            "make": "KARIN",
            "engine": "Mod -1",
            "fuelLevel": 100.0,
            "transmission": "Standard Transmission",
            "model": 970598228
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


    return (
        <Paper p={10} radius={10} style={{ position: 'absolute', left: position.x, top: position.y, display: visible ? 'block' : 'none', opacity: 0.9 }}>
            {vehicleData ? (
                <div>
                    <Stack spacing={5} align="center">
                        <Text size={24}> {vehicleData.make} {vehicleData.displayname}</Text>
                        <Group position="apart">
                            <ProgressBar value={vehicleData.fuelLevel} text={lang.GarageMenu9} icon={<IconGasStation size={17} />} />
                            <ProgressBar value={vehicleData.engineHealth} text={lang.GarageMenu10} icon={<IconEngine size={17} />} />
                            <ProgressBar value={vehicleData.bodyHealth} text={lang.GarageMenu11} icon={<IconCarCrash size={17} />} />
                        </Group>
                    </Stack>

                </div>
            ) : (
                <div>Loading...</div>
            )}
        </Paper>
    );
};

export default VehicleToolTip;
