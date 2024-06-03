import React, { useState, useEffect } from 'react';
import { fetchNui } from "../utils/fetchNui";
import ProgressBar from './lit/progress';
import Lang from '../utils/LangR';
import { IconAlertCircle, IconCarCrash, IconCarGarage, IconEngine, IconGasStation, IconKey, IconMapSearch, IconMoneybag, IconSettings, IconTrash } from '@tabler/icons-react';
import { Accordion, Button, Badge, Group, SimpleGrid, Select, Stack, Text, Paper, Alert, ActionIcon } from '@mantine/core';

interface VehicleProps {
    vehicle: any;
    index: number;
    garage: any;
}

const Vehicle: React.FC<VehicleProps> = ({ vehicle, index, garage }) => {
    const [vehicleData, setVehicleData] = useState(vehicle)
    const [paymentMethod, setPaymentMethod] = useState('money');
    const lang = Lang();
    let pound

    useEffect(() => {
        setVehicleData(vehicle);
    }, [vehicle]);

    const ShowMenuKeys = () => {
        fetchNui<any>('mGarage:PlyInteract', { action: 'keys', plate: vehicle.plate });
    };

    const SpawnVehicle = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'spawn', data: { vehicleid: vehicle.id, garage: garage } });
        if (fetchData) {
            const updatedVehicleData = { ...vehicleData };
            updatedVehicleData.stored = 0;
            setVehicleData(updatedVehicleData);
            fetchNui('mGarage:Close', { name: 'setVisibleGarage' });

        }
    };

    const Impound = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'impound', data: { vehicleid: vehicle.id, garage: garage, paymentMethod: paymentMethod } });
        if (fetchData) {
            fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
        }
    };

    const SetBlip = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'setBlip', data: { plate: vehicleData.plate } });
        if (fetchData) {
            fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
        }
    };

    const handleChangePaymentMethod = (value: string | null) => {
        if (value !== null) {
            setPaymentMethod(value);
        }
    };

    const SpawnCustomVehicle = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'spawncustom', data: { vehicle: vehicleData, garage: garage } });
        if (fetchData) {
            fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
        }
    };

    if (vehicle.infoimpound) {
        pound = JSON.parse(vehicle.infoimpound);
    }
    return (
        <Accordion.Item key={index} value={`${vehicle.vehlabel}_${vehicle.plate}_${index}`} >
            <Accordion.Control sx={{
                '&:hover': {
                    backgroundColor: '#1A1B1E',
                    borderRadius: 5
                },

            }}>
                <Group position="apart" >
                    {garage.garagetype === 'custom' ? (
                        <>
                            <Badge radius={5} color={'green'} >{vehicle.vehlabel}</Badge>
                            {vehicle.price > 0 && (
                                <Badge radius={5} color='green'>
                                    {vehicle.price}
                                </Badge>
                            )}
                        </>
                    ) : (
                        <>
                            <Badge
                                radius={5}
                                color={(vehicle.stored === 1 || garage.garagetype === 'impound' || garage.garagetype === 'custom') ? 'green' : 'red'}
                            >
                                {vehicle.vehlabel}
                            </Badge>

                            <Badge radius={5} >{vehicle.plate}</Badge>
                        </>
                    )}

                </Group>
            </Accordion.Control >
            <Accordion.Panel sx={{ backgroundColor: '#2e3036' }}>
                <Paper p='xs' >
                    {garage.garagetype === 'custom' && (
                        <Button fullWidth onClick={SpawnCustomVehicle} leftIcon={<IconCarGarage size={17} />} variant="light" size='xs' >
                            {lang.GarageMenu5}
                        </Button>
                    )}
                    {garage.garagetype === 'impound' && (
                        <>
                            {pound && (
                                <Stack>
                                    <Group position="apart">
                                        <Badge color='green'>{lang.GarageMenu1} {pound.price}$</Badge>
                                        <Badge color='yellow'>{lang.GarageMenu2} {pound.date}</Badge>
                                    </Group>
                                    {pound.endPound && (
                                        <Alert p={5} icon={<IconAlertCircle />} title={lang.ImpoundOption12} color="red" >
                                            <Text size={20}>{pound.endPound}</Text>
                                        </Alert>
                                    )}
                                    <Paper p='xs'>
                                        <Text c="dimmed">{pound.reason}</Text>
                                    </Paper>
                                    <Select
                                        label={lang.GaragePayMethod}
                                        value={paymentMethod}
                                        onChange={handleChangePaymentMethod}

                                        data={[
                                            { value: 'money', label: lang.GaragePayMethodMoney },
                                            { value: 'bank', label: lang.GaragePayMethodBank },
                                        ]}
                                    />
                                    <Button onClick={Impound} variant="light" size='xs' leftIcon={<IconMoneybag size={15} />}>
                                        {lang.GarageMenu3}
                                    </Button>
                                </Stack>
                            )}

                        </>
                    )}
                    {garage.garagetype === 'garage' && (
                        <Stack>
                            <SimpleGrid cols={2} >
                                <ProgressBar value={vehicle.fuelLevel} text={lang.GarageMenu9} icon={<IconGasStation size={17} />} />
                                <ProgressBar value={vehicle.engineHealth} text={lang.GarageMenu10} icon={<IconEngine size={17} />} />
                                <ProgressBar value={vehicle.bodyHealth} text={lang.GarageMenu11} icon={<IconCarCrash size={17} />} />
                                <Paper style={{ backgroundColor: '#373A40', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <Text fz="md">{lang.GarageMenu4}</Text>
                                    <Text fz="xs" fw={700} c="teal.4">{vehicle.mileage}</Text>
                                </Paper>

                                {vehicle.fakeplate && (
                                    <Paper style={{ backgroundColor: '#373A40', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                          <Text fz="xs">Fake Plate</Text>
                                        <Badge radius={5} color='yellow' >{vehicle.fakeplate}</Badge>
                                    </Paper>
                                )}
                            </SimpleGrid>

                            <Button.Group >
                                <Button fullWidth onClick={SpawnVehicle} disabled={vehicle.stored == 0} leftIcon={<IconCarGarage size={17} />} variant="light" size='xs' >{lang.GarageMenu5}</Button>
                                {vehicle.isOwner && (
                                    <>
                                        <Button fullWidth onClick={ShowMenuKeys} variant="light" size='xs' leftIcon={<IconKey size={17} />}>{lang.GarageMenu6}</Button>
                                        <Button fullWidth onClick={SetBlip} variant="light" size='xs' leftIcon={<IconMapSearch size={17} />} disabled={vehicle.stored == 1}>{lang.GarageMenu7}</Button>
                                    </>
                                )}

                            </Button.Group>
                        </Stack>
                    )}
                </Paper>
            </Accordion.Panel>
        </Accordion.Item >
    );
};

export default Vehicle;
