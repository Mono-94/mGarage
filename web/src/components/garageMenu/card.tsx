import React, { useState, useEffect } from 'react';
import { fetchNui } from "../../utils/fetchNui";
import { useLang } from '../../utils/LangContext';
import { IconCarCrash, IconCarGarage, IconEngine, IconGasStation, IconKey, IconMapPin, IconMoneybag, IconPencil, } from '@tabler/icons-react';
import { Button, Badge, Group, Select, Stack, Text, Progress, Card, ActionIcon, Box, Indicator, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from '../garageTools/vehName';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { isEnvBrowser } from '../../utils/misc';


interface VehicleProps {
    vehicle: any;
    index: number;
    garage: any;
    Close: any;
}


const VehCard: React.FC<VehicleProps> = ({ vehicle, index, garage, Close }) => {
    const [vehicleData, setVehicleData] = useState(vehicle);
    const [paymentMethod, setPaymentMethod] = useState('money');
    const [opened, { toggle, close }] = useDisclosure(false);
    const [isSpawning, setIsSpawning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lang = useLang();
    const web = isEnvBrowser();
    let pound;

    useEffect(() => {
        setVehicleData(vehicle);
    }, [vehicle]);


    const ShowMenuKeys = () => {
        fetchNui<any>('mGarage:PlyInteract', { action: 'keys', plate: vehicle.plate });
        Close();
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
        } else {
            setIsSpawning(false);
            setIsLoading(false);
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

    const ClearName = async () => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'changeName', data: { vehicle: vehicleData } });
        if (fetchData) {
            setVehicleData((prevVehicleData: any) => ({
                ...prevVehicleData,
                vehlabel: vehicle.vehlabel_original
            }));
        }
    };

    if (vehicle.infoimpound) {
        pound = JSON.parse(vehicle.infoimpound);
    }

    const getProgressColor = (val: number): "green" | "yellow" | "red" => {
        if (val >= 70) {
            return "green";
        } else if (val >= 30) {
            return "yellow";
        } else {
            return "red";
        }
    };
    const progress = (value: number, icon: ReactJSXElement, text: string) => {
        const fuelColor = getProgressColor(value);

        return (
            <Group spacing={2}>
                {icon}
                <Box sx={{ position: 'relative', width: 305 }}>
                    <Progress
                        value={value}
                        radius={4}
                        h={17}
                        color={fuelColor}
                    />
                    <Group
                        position="apart"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            transform: 'translateY(-50%)',
                            padding: '0 8px',
                            pointerEvents: 'none',
                        }}
                    >
                        <Text size={11} color="white">
                            {value}%

                        </Text>
                        <Text size={11} color="white">
                            {text}
                        </Text>
                    </Group>
                </Box>

            </Group>
        );
    };



    return (
        <Indicator size={8} offset={8} position='top-start'
            color={vehicle.stored === 0 ? 'red' : 'green'}>
            <Card key={index} bg={'#2C2E33'} p={5} withBorder
                style={{
                    transition: 'box-shadow 0.5s ease',
                }}
                sx={{
                    '&:hover': {
                        boxShadow: 'inset 0px 0px 60px 1px rgba(255, 255, 255, 0.06)',
                    },
                }}>

                <Stack spacing={5}>

                    <Group position='apart'>

                        {garage.garagetype === 'custom' ?
                            <Badge bg={'#242424'} color="dark" radius={4} p={10}>{vehicleData.vehlabel}</Badge>
                            :
                            <>

                                <Badge bg={'#242424'} color="dark" radius={4} p={10} size="md" maw={190}>{vehicleData.vehlabel}</Badge>

                                <Group spacing={3}>
                                    <Badge color="dark" bg={'#242424'} radius={4}  p={10} size="md" >{ vehicle.plate}</Badge>
                                    {vehicle.isOwner && vehicle.stored === 0 && vehicle.coords && (
                                        <ActionIcon
                                            radius={4}
                                            size={20}
                                            variant="light"
                                            color="green"
                                            onClick={SetBlip}
                                        >
                                            <IconMapPin size={15} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </>
                        }
                    </Group>



                    {garage.garagetype === 'custom' && (
                        <Button fullWidth onClick={SpawnCustomVehicle} leftIcon={<IconCarGarage size={17} />} variant="light" size='xs'>
                            {lang.GarageMenu5}
                        </Button>
                    )}

                    {garage.garagetype === 'impound' && (<>
                        {pound && (<>
                            <Stack spacing={5}>

                                <Card p={10} sx={{ marginBottom: 'auto' }} >
                                    {`${lang.GarageMenu2} ${pound.date} `}
                                    {pound.endPound && (<Text size={12} fw={700} color='red'> {lang.ImpoundOption12} {pound.endPound}</Text>)}
                                    <Text c="blue" >{pound.reason}</Text>
                                </Card>

                                <Card p={10} sx={{ marginBottom: 'auto' }}>
                                    <Stack >
                                        <Select
                                            dropdownPosition="bottom"
                                            withinPortal={true}
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
                                </Card>

                            </Stack>
                        </>)}
                    </>)}

                    {garage.garagetype === 'garage' && (<>

                        <Card p={5} bg={'#242424'}>
                            <Stack justify="space-around" spacing={1}>
                                {progress(vehicleData.fuelLevel, <IconGasStation size={19} />, lang.GarageMenu9)}
                                {progress(vehicleData.engineHealth, <IconEngine size={19} />, lang.GarageMenu10)}
                                {progress(vehicleData.bodyHealth, <IconCarCrash size={19} />, lang.GarageMenu11)}
                            </Stack>
                        </Card>
                        <Card p={5} bg={'#242424'}>
                            <Button.Group sx={{ gap: 2 }}  >
                                <Button fullWidth size="xs" compact color="green" onClick={SpawnVehicle} disabled={vehicleData.stored == 0 || isSpawning} loading={isLoading} leftIcon={<IconCarGarage size={17} />} variant="light" >{lang.GarageMenu5}</Button>
                                {vehicle.isOwner && (<>
                                    <Button fullWidth size="xs" compact variant="light" onClick={toggle} leftIcon={<IconPencil size={17} />} >{lang.ui_name1}</Button>
                                    <Button fullWidth onClick={ShowMenuKeys} variant="light" size="xs" compact leftIcon={<IconKey size={17} />}>{lang.GarageMenu6}</Button>
                                    <AuthModal opened={opened} close={close} vehicleLabel={vehicleData.vehlabel} onChangeName={ChangeName} onCleanName={ClearName} />
                                </>)}

                            </Button.Group>
                        </Card>
                    </>)}

                </Stack>

            </Card>
        </Indicator>
    );
};

export default VehCard;
