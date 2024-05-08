import React, { useState, useEffect } from 'react';
import { Accordion, Button, Badge, Group, Divider, SimpleGrid, Select, Stack, Text, Paper } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faMapLocationDot, faCarOn, faGasPump, faCarBurst, faGears } from '@fortawesome/free-solid-svg-icons';
import { fetchNui } from "../utils/fetchNui";
import ProgressBar from './lit/progress';
import Lang from '../utils/LangR';
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

    const RentACar = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'rentcar', data: { vehicleid: vehicle.id, garage: garage, paymentMethod: paymentMethod } });

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
    if (vehicle.infoimpound) {
        pound = JSON.parse(vehicle.infoimpound);
    }

    const handleChangePaymentMethod = (value: string | null) => {
        if (value !== null) {
            setPaymentMethod(value);
        }
    };


    return (
        <Accordion.Item key={index} value={`${vehicle.vehlabel}_${vehicle.plate}_${index}`} >
            <Accordion.Control>
                <Group position="apart" >
                    <Badge color={
                        (vehicle.stored === 1 || vehicle.pound === 1 || vehicle.stored === null) ? 'green' : 'red'
                    } size='md'>{vehicle.vehlabel}</Badge>
                    <Badge size='md'>{vehicle.plate}</Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                {garage.garagetype === 'impound' && (
                    <Paper p='xs' style={{ backgroundColor: '#373A40' }}>
                        {pound && (
                            <>
                                <Stack>

                                    <Group position="apart">
                                        <Badge color='green'>{lang.GarageMenu1} {pound.price}$</Badge> 
                                        <Badge color='yellow'>{lang.GarageMenu2} {pound.date}</Badge>
                                    </Group>

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
                                    <Button fullWidth onClick={Impound} variant="light" size='xs'>
                                    {lang.GarageMenu3}
                                    </Button>
                                </Stack>

                            </>
                        )}

                    </Paper>
                )}
                {garage.garagetype === 'garage' && (
                    <>
                        <SimpleGrid cols={2} >
                            <ProgressBar value={vehicle.fuelLevel} text={lang.GarageMenu9} icon={<FontAwesomeIcon icon={faGasPump} />} />
                            <ProgressBar value={vehicle.engineHealth} text={lang.GarageMenu10} icon={<FontAwesomeIcon icon={faGears} />} />
                            <ProgressBar value={vehicle.bodyHealth} text={lang.GarageMenu11} icon={<FontAwesomeIcon icon={faCarBurst} />} />

                            <Paper style={{ backgroundColor: '#373A40', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                <Text fz="md">{lang.GarageMenu4}</Text>
                                <Text fz="xs" fw={700} c="teal.4">{vehicle.mileage}</Text>
                            </Paper>
                        </SimpleGrid>
                        <Divider my="sm" />

                        <Button.Group >
                            <Button fullWidth onClick={SpawnVehicle} disabled={!vehicle.stored} leftIcon={<FontAwesomeIcon icon={faCarOn} />} variant="light" size='xs' >{lang.GarageMenu5}</Button>
                            {vehicle.isOwner && (
                                <>
                                    <Button fullWidth onClick={ShowMenuKeys} variant="light" size='xs' leftIcon={<FontAwesomeIcon icon={faKey} />}>{lang.GarageMenu6}</Button>
                                    <Button fullWidth onClick={SetBlip} variant="light" size='xs' leftIcon={<FontAwesomeIcon icon={faMapLocationDot} />} disabled={vehicle.stored}>{lang.GarageMenu7}</Button>
                                </>
                            )}

                        </Button.Group>
                    </>
                )}
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default Vehicle;
