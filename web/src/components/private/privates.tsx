import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Lang from '../../utils/LangR';
import { debugData } from '../../utils/debugData';
import { Button, Text, Group, Box, Transition, Table, Modal, TextInput, Tabs, ActionIcon, CloseButton, ScrollArea, SimpleGrid, Paper, Stack, Divider, NumberInput, Badge, Tooltip, Card, Image } from '@mantine/core';
import { IconBox, IconBuildingWarehouse, IconCar, IconCarGarage, IconKey, IconMessageCircle, IconPencil, IconPhoto, IconPlus, IconSettings, IconTrash, IconUser, IconUsers } from '@tabler/icons-react';
import AuthModal from '../lit/vehName';
debugData([
    {
        action: 'private',
        data: {
            "owner": "char1:559586a641fc2fbf1077189e89cd24ad50b43f01",
            "garage": {
                "moneytype": "money",
                "enter": 4,
                "coordsVehicleEnter": {
                    "x": 333.22088623046877,
                    "y": -998.1754150390624,
                    "z": 28.60320091247558,
                    "w": 180.1009063720703
                },
                "door": {
                    "x": 328.3622131347656,
                    "y": -994.5388793945313,
                    "z": 29.31439971923828,
                    "w": 185.001205444336
                },
                "access": {
                    "char1:559586a641fc2fbf1077189e89cd24ad50b43f01": "Mono Test",
                    "char2:559586a641fc2fbf1077189e89cd24ad50b43f01": "Raw Paper",
                    "char3:559586a641fc2fbf1077189e89cd24ad50b43f01": "Masdfdsn Yurin",
                    "char4:559586a641fc2fbf1077189e89cd24ad50b43f01": "Man Yurin",
                    "char5:559586a641fc2fbf1077189e89cd24ad50b43f01": "Msdfsdfan Yurin",
                    "char6:559586a641fc2fbf1077189e89cd24ad50b43f01": "Man Yurin",
                    "char7:559586a641fc2fbf1077189e89cd24ad50b43f01": "Masdfsdfn Yudsfsdrin",
                    "char8:559586a641fc2fbf1077189e89cd24ad50b43f01": "Madfsdfn Yurin",
                    "char9:559586a641fc2fbf1077189e89cd24ad50b43f01": "Man Yurdssdfsdfin",
                    "char10:559586a641fc2fbf1077189e89cd24ad50b43f01": "Man Yurdssdfin",
                    "char11:559586a641fc2fbf1077189e89cd24ad50b43f01": "Msdfsdan Yurdfsfin",
                    "char12:559586a641fc2fbf1077189e89cd24ad50b43f01": "Masdasdsadan Yurin",
                    "char13:559586a641fc2fbf1077189e89cd24ad50b43f01": "Man Yursdfsdfin",
                    "char14:559586a641fc2fbf1077189e89cd24ad50b43f01": "Msdfdsfan Yurin",
                    "char15:559586a641fc2fbf1077189e89cd24ad50b43f01": "Masdfsdn Yurin",
                },
                "slots": [
                    {
                        "coords": {
                            "x": 171.37649536132813,
                            "y": -1003.8900756835938,
                            "z": -99.41200256347656,
                            "w": 180.8424072265625
                        },
                        "busy": false,
                        "vehname": "Test Vehiculo ",
                        "isOwner": true
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "busy": false,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,

                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                    {
                        "coords": {
                            "x": 174.8737945556641,
                            "y": -1003.944091796875,
                            "z": -99.41190338134766,
                            "w": 180.45620727539066
                        },
                        "plate": "MONO 420",
                        "busy": true,
                        "vehname": "Test Vehiculo",
                        "isOwner": true,
                    },
                ],
                "name": "Private garage Small - Mission Row",
                "price": 95000,

                "interior": 1,
                "ownerName": "Mono Test"
            },
            "name": "Private garage Small - Mission Row",
            "id": 1,
            "image": "https://i.imgur.com/wYittKy.png",
            "private": true
        }
    }
], 100);

const PrivateGarages: React.FC<{ visible: boolean }> = ({ visible }) => {
    const lang = Lang();
    const [dataPrivate, setDataPrivate] = useState<any>({});
    const [newAccess, setNewAccess] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<any>(null); // Nuevo estado
    const [modalOpened, setModalOpened] = useState(false); // Nuevo estado

    useNuiEvent<any>('private', (data) => {
        setDataPrivate(data);
    });

    const addAccess = async () => {
        const fetchData = await fetchNui<any>('privateGarage', { action: 'addFriend', target: newAccess, garage: dataPrivate.garage });
        if (fetchData !== false) {
            setDataPrivate((prev: any) => ({
                ...prev,
                garage: {
                    ...prev.garage,
                    access: fetchData,
                },
            }));
            setNewAccess(0);
        }
    };

    const removeAccess = async (identifier: string, name: string) => {
        const fetchData = await fetchNui<any>('privateGarage', { action: 'removeFriend', identifier: identifier, plyname: name, garage: dataPrivate.garage });
        if (fetchData !== false) {
            setDataPrivate((prev: any) => ({
                ...prev,
                garage: {
                    ...prev.garage,
                    access: fetchData,
                },
            }));
        }
    };

    const OpenStash = () => {
        fetchNui<any>('privateGarage', { action: 'openStash', garage: dataPrivate.garage });
    };

    const accessRows = Object.entries(dataPrivate.garage?.access || {}).map(([identifier, name]) => (
        <React.Fragment key={identifier}>
            <Group position="apart" style={{ marginRight: 20 }}>
                <Badge radius={4} >{name}</Badge>
                <Button compact size="xs" color='red' variant="light" leftIcon={<IconTrash size="1rem" />} onClick={() => removeAccess(identifier, name)}>Remove Access</Button>
            </Group>
        </React.Fragment>
    ));

    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisiblePrivates' });
    };

    const hasAccessRows = accessRows.length > 0;

    const handleChangeName = async (newName: string) => {
        const fetchData = await fetchNui<any>('mGarage:PlyInteract', { action: 'changeName', data: { vehicle: selectedSlot, newName: newName } });
        if (fetchData) {
            if (selectedSlot) {
                const updatedSlots = dataPrivate.garage.slots.map((slot: any) =>
                    slot === selectedSlot ? { ...slot, vehname: newName } : slot
                );
                setDataPrivate((prev: any) => ({
                    ...prev,
                    garage: {
                        ...prev.garage,
                        slots: updatedSlots,
                    },
                }));
            }
        }
    };

    const openModal = (slot: any) => {
        setSelectedSlot(slot);
        setModalOpened(true);
    }

    const closeModal = () => {
        setModalOpened(false);
        setSelectedSlot(null);
    }

    const truncateString = (str: string, maxLength: number) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    };

    const ShowMenuKeys = (plate: string) => {
        fetchNui<any>('privateGarage', { action: 'accessVeh', plate: plate });
    };
    const GiveKey = (plate: string) => {
        fetchNui<any>('privateGarage', { action: 'givekey', plate: plate });
    };
    return (
        <Transition mounted={visible} transition="slide-left" duration={600} timingFunction="ease">
            {(styles) => <div style={styles} className='Private'>

                <Tabs variant="pills" defaultValue="Garage" color='gray'>
                    <Tabs.List>
                        <Tabs.Tab value="Garage" icon={<IconBuildingWarehouse size="0.8rem" />}>{lang.private_ui8}</Tabs.Tab>
                        <Tabs.Tab value="Access" icon={<IconUsers size="0.8rem" />}>{lang.private_ui9}</Tabs.Tab>
                        <Tabs.Tab value="Vehicles" icon={<IconCarGarage size="0.8rem" />}>{lang.private_ui10}</Tabs.Tab>
                        <CloseButton radius={10} size={'md'} onClick={handleClose} color="red" variant="light" style={{ marginLeft: 'auto' }} />
                    </Tabs.List>

                    <Tabs.Panel value="Garage" pt="xs">

                        <Paper p={10} radius={10}>
                            <Card shadow="sm" padding="lg" radius="md" >
                                <Card.Section>

                                    <Image
                                        src={dataPrivate.image}
                                        height={150}
                                        width={500}
                                    />
                                </Card.Section>

                                <Group position="apart" mt="md" mb="xs">
                                    <Text weight={500} size="xl">{dataPrivate.name}</Text><Text weight={500} size="md">{dataPrivate.garage.ownerName}</Text>
                                </Group>

                                <Text size="sm" color="dimmed">
                                    <Group position="apart">
                                        <Text>{lang.private_ui4}</Text> <Text weight={'bold'}>${dataPrivate.garage.price}</Text>
                                    </Group>
                                    <Group position="apart">
                                        <Text>{lang.private_ui5}</Text> <Text weight={'bold'}>{dataPrivate.streetName}</Text>
                                    </Group>
                                    <Group position="apart">
                                        <Text>{lang.private_ui6}</Text> <Text weight={'bold'}>{dataPrivate.garage.slots.length}</Text>
                                    </Group>
                                    <Group position="apart">
                                        <Text>{lang.private_ui7}</Text> <Text weight={'bold'}>{dataPrivate.garage.slots.filter((slot: any) => slot.busy).length}</Text>
                                    </Group>

                                </Text>
                                <Button variant="light" color="blue" fullWidth mt="md" radius="md" leftIcon={<IconBox size={15} />} onClick={OpenStash}>
                                    {lang.private_manage5}
                                </Button>
                            </Card>
                        </Paper>

                    </Tabs.Panel>

                    <Tabs.Panel value="Access" pt="xs">
                        <Paper p={10} radius={10} >
                            <Text size={25}>Access</Text>
                            <Stack>
                                <Stack p={10}>
                                    <NumberInput
                                        size="xs"
                                        placeholder="Player ID"
                                        label="Player ID"
                                        onChange={(value: number) => setNewAccess(value)}

                                        min={0}
                                        max={10000}
                                    />
                                    <Button color='green' size="xs" variant="light" leftIcon={<IconPlus size={15} />} onClick={addAccess}>
                                        {lang.private_ui11}
                                    </Button>
                                    {hasAccessRows && (
                                        <ScrollArea.Autosize mah={200} p={10} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} scrollbarSize={10}>
                                            <SimpleGrid cols={1}>
                                                {accessRows}
                                            </SimpleGrid>
                                        </ScrollArea.Autosize>
                                    )}
                                </Stack>

                            </Stack>


                        </Paper>
                    </Tabs.Panel>

                    <Tabs.Panel value="Vehicles" pt="xs">
                        <Paper p={10} radius={10}>
                            <Text size={25}>{lang.private_ui10}</Text>
                            <Table highlightOnHover >

                                <thead>
                                    <tr>
                                        <th>{lang.private_ui12}</th>
                                        <th>{lang.private_ui13}</th>
                                        <th>{lang.private_ui14}</th>
                                        <th>{lang.private_ui15}</th>
                                    </tr>
                                </thead>

                            </Table>
                            <ScrollArea.Autosize mah={300} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} scrollbarSize={10}>
                                <Table >
                                    <tbody>
                                        {dataPrivate.garage?.slots.map((slot: any, index: number) => (
                                            <tr key={index}>
                                                <td> <Group position="center">{lang.private_ui12} {index + 1}</Group></td>
                                                <td>
                                                    <Group position="center">
                                                        {slot.busy ? (truncateString(slot.vehname, 15)) : '-'}
                                                    </Group>
                                                </td>

                                                <td><Group position="center">{slot.busy ? (<Badge radius={5}>{slot.plate}</Badge>) : '-'}</Group></td>
                                                <td>
                                                    <Group position="center">
                                                        {slot.busy ? (<>
                                                            <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={200} color='teal' label={lang.private_ui16} transitionProps={{ transition: 'skew-down', duration: 300 }} withArrow>
                                                                <ActionIcon disabled={!slot.isOwner} color='green' variant="light" onClick={() => ShowMenuKeys(slot.plate)}>
                                                                    <IconUsers size="1rem" />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={200} color='blue' label={lang.private_ui17} transitionProps={{ transition: 'skew-down', duration: 300 }} withArrow>
                                                                <ActionIcon disabled={!slot.isOwner} color='blue' variant="light" onClick={() => openModal(slot)}>
                                                                    <IconPencil size={15} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            {dataPrivate.giveKey && (
                                                                <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={200} color='yellow' label={lang.private_ui18} transitionProps={{ transition: 'skew-down', duration: 300 }} withArrow>
                                                                    <ActionIcon color='yellow' variant="light" onClick={() => GiveKey(slot.plate)}>
                                                                        <IconKey size={15} />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            )}

                                                        </>) : '-'}
                                                    </Group>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ScrollArea.Autosize>
                        </Paper>
                    </Tabs.Panel>


                </Tabs>



                {selectedSlot && (
                    <AuthModal
                        opened={modalOpened}
                        close={closeModal}
                        vehicleLabel={selectedSlot.vehname}
                        onChangeName={handleChangeName}
                    />
                )}




            </div>}
        </Transition>
    );
};

export default PrivateGarages;
