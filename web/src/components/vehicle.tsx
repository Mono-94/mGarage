import React, { useState, useEffect } from 'react';
import { fetchNui } from "../utils/fetchNui";
import ProgressBar from './lit/progress';
import Lang from '../utils/LangR';
import { IconCarCrash, IconCarGarage, IconEngine, IconFileInfo, IconGasStation, IconKey, IconMapSearch, IconMoneybag, IconPencil } from '@tabler/icons-react';
import { Accordion, Button, Badge, Group, Select, Stack, Text, Paper, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from './lit/vehName';

interface VehicleProps {
    vehicle: any;
    index: number;
    garage: any;
    Close: any;
}

const Vehicle: React.FC<VehicleProps> = ({ vehicle, index, garage, Close }) => {
    const [vehicleData, setVehicleData] = useState(vehicle);
    const [paymentMethod, setPaymentMethod] = useState('money');
    const [opened, { toggle, close }] = useDisclosure(false);
    const [isSpawning, setIsSpawning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lang = Lang();
    let pound;

    useEffect(() => {
        setVehicleData(vehicle);
    }, [vehicle]);

    const ShowMenuKeys = () => {
        fetchNui<any>('mGarage:PlyInteract', { action: 'keys', plate: vehicle.plate });
    };

    const SpawnVehicle = async () => {
        setIsSpawning(true);
        setIsLoading(true);
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'spawn', data: { vehicleid: vehicle.id, garage: garage } });
        if (fetchData) {
            vehicle.stored = 0;
            setIsSpawning(false);
            setIsLoading(false);
            Close();
        }
    };

    const Impound = async () => {
        setIsLoading(true);
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'impound', data: { vehicleid: vehicle.id, garage: garage, paymentMethod: paymentMethod } });
        if (fetchData) {
            Close();
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const SetBlip = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'setBlip', data: { plate: vehicleData.plate } });
        if (fetchData) {
            Close();
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
            Close();
        }
    };

    const ChangeName = async (newName: string) => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'changeName', data: { vehicle: vehicleData, newName: newName } });
        if (fetchData) {
            setVehicleData((prevVehicleData: any) => ({
                ...prevVehicleData,
                vehlabel: newName
            }));
        }
    };

    if (vehicle.infoimpound) {
        pound = JSON.parse(vehicle.infoimpound);
    }

    return (
        <Accordion.Item key={index} value={`${vehicle.plate}_${index}`}>
            <Accordion.Control>
                <Group position="apart">
                    {garage.garagetype === 'custom' ? (
                        <>
                            <Badge radius={5} color={'green'}>{vehicleData.vehlabel}</Badge>
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
                                {vehicleData.vehlabel}
                            </Badge>
                            <Badge radius={5} color={vehicle.fakeplate ? 'yellow' : ''}>{vehicle.fakeplate ? vehicle.fakeplate : vehicle.plate}</Badge>
                        </>
                    )}
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Paper p={5} radius={10}>
                    {garage.garagetype === 'custom' && (
                        <Button fullWidth onClick={SpawnCustomVehicle} leftIcon={<IconCarGarage size={17} />} variant="light" size='xs'>
                            {lang.GarageMenu5}
                        </Button>
                    )}
                    {garage.garagetype === 'impound' && (<>
                        {pound && (<>
                            <Alert p={5} radius={10} icon={<IconFileInfo />} title={`${lang.GarageMenu2} ${pound.date} `} color={"gray"} variant="filled">
                                {pound.endPound && (<Text size={12} fw={700} color='red'> {lang.ImpoundOption12} {pound.endPound}</Text>)}
                                <Text c="dimmed">{pound.reason}</Text>
                            </Alert>
                            <Stack >
                                <Select
                                    dropdownPosition={"bottom"}
                                    label={lang.GaragePayMethod}
                                    value={paymentMethod}
                                    onChange={handleChangePaymentMethod}
                                    data={[
                                        { value: 'money', label: lang.GaragePayMethodMoney },
                                        { value: 'bank', label: lang.GaragePayMethodBank },
                                    ]}
                                />
                                <Button onClick={Impound} variant="light" size='xs' color={'teal'} loading={isLoading} leftIcon={<IconMoneybag size={15} />}>
                                    {lang.GarageMenu3} | {pound.price.toLocaleString('en-US')} $
                                </Button>
                            </Stack>
                        </>)}
                    </>)}
                    {garage.garagetype === 'garage' && (
                        <Group grow spacing={5} align="flex-start">
                            <Stack spacing={5}>
                                <Group position="center" sx={{ backgroundColor: '#2e3036', borderRadius: 5, height: 65 }} >
                                    <ProgressBar value={vehicleData.fuelLevel} text={lang.GarageMenu9} icon={<IconGasStation size={17} />} />
                                    <ProgressBar value={vehicleData.engineHealth} text={lang.GarageMenu10} icon={<IconEngine size={17} />} />
                                    <ProgressBar value={vehicleData.bodyHealth} text={lang.GarageMenu11} icon={<IconCarCrash size={17} />} />
                                </Group>
                                <Paper style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#2e3036', borderRadius: 5, height: 30, alignItems: 'center' }}>
                                    <Group position="center" p={5} >
                                        <Text fz="md">{lang.GarageMenu4}</Text>
                                        <Text fz="xs" fw={700} c="teal.4">{vehicleData.mileage}</Text>
                                    </Group>
                                </Paper>
                                {vehicle.isOwner && (<AuthModal opened={opened} close={close} vehicleLabel={vehicleData.vehlabel} onChangeName={ChangeName} />)}
                            </Stack>
                            <Stack justify="flex-start" spacing={5} >
                                <Button color="green" onClick={SpawnVehicle} disabled={vehicleData.stored == 0 || isSpawning} loading={isLoading} leftIcon={<IconCarGarage size={17} />} variant="light" size='xs'>{lang.GarageMenu5}</Button>
                                {vehicle.isOwner && (<>
                                    <Button size='xs' variant="light" onClick={toggle} leftIcon={<IconPencil size={17} />} >{lang.ui_name1}</Button>
                                    <Button onClick={ShowMenuKeys} variant="light" size='xs' leftIcon={<IconKey size={17} />}>{lang.GarageMenu6}</Button>
                                    <Button onClick={SetBlip} variant="light" size='xs' leftIcon={<IconMapSearch size={17} />} disabled={vehicleData.stored == 1}>{lang.GarageMenu7}</Button>
                                </>)}
                            </Stack>
                        </Group>
                    )}
                </Paper>
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default Vehicle;
