import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Lang from '../../utils/LangR';
import { debugData } from '../../utils/debugData';
import { Button, Text, Group, Box, Transition, Table, Modal, TextInput, Tabs, ActionIcon, CloseButton, ScrollArea, SimpleGrid, Paper, Stack, Divider, NumberInput, Badge, Tooltip } from '@mantine/core';
import { IconBox, IconBuildingWarehouse, IconCar, IconCarGarage, IconKey, IconMessageCircle, IconPhoto, IconPlus, IconSettings, IconTrash, IconUser, IconUsers } from '@tabler/icons-react';

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
                        "vehname": "Test Vehiculo",
                        "isOwner": false
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
                        "isOwner": false,

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
            "private": true
        }
    }
], 100);

const PrivateGarages: React.FC<{ visible: boolean }> = ({ visible }) => {
    const lang = Lang();
    const [dataPrivate, setDataPrivate] = useState<any>({});
    const [newAccess, setNewAccess] = useState(0);

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

    const garageInfo = dataPrivate.garage ? (
        <SimpleGrid cols={2}>
            <Text size="sm"><strong>Owner:</strong> {dataPrivate.garage.ownerName}</Text>
            <Text size="sm"><strong>Price:</strong> ${dataPrivate.garage.price}</Text>
            <Text size="sm"><strong>Location:</strong> {dataPrivate.garage.name}</Text>
            <Text size="sm"><strong>Slots:</strong> {dataPrivate.garage.slots.length}</Text>
            <Text size="sm"><strong>Occupied Slots:</strong> {dataPrivate.garage.slots.filter((slot: any) => slot.busy).length}</Text>
        </SimpleGrid>
    ) : null;

    return (
        <Transition mounted={visible} transition="slide-left" duration={600} timingFunction="ease">
            {(styles) => <div style={styles} className='Private'>

                <Tabs variant="pills" defaultValue="Garage" color='gray'>
                    <Tabs.List>
                        <Tabs.Tab value="Garage" icon={<IconBuildingWarehouse size="0.8rem" />}>Garage</Tabs.Tab>
                        <Tabs.Tab value="Access" icon={<IconUsers size="0.8rem" />}>Access</Tabs.Tab>
                        <Tabs.Tab value="Vehicles" icon={<IconCarGarage size="0.8rem" />}>Vehicles</Tabs.Tab>
                        <CloseButton radius={10} size={'md'} onClick={handleClose} color="red" variant="light" style={{ marginLeft: 'auto' }} />
                    </Tabs.List>

                    <Tabs.Panel value="Garage" pt="xs">
                        <Paper p={10} radius={10} >
                            <Text size={20}>{dataPrivate.name}</Text>
                            {garageInfo}
                            <Button color={'brown'} size="xs" variant="light" leftIcon={<IconBox size={15} />} onClick={OpenStash}>
                                Open Stash
                            </Button>
                        </Paper>

                    </Tabs.Panel>

                    <Tabs.Panel value="Access" pt="xs">
                        <Paper p={10} radius={10} >
                            <Text size={25}>Access</Text>
                            <Stack>
                                <Stack style={{ border: '1px solid #2e3036', borderRadius: 5 }} p={10}>
                                    <NumberInput
                                        size="xs"
                                        placeholder="Player ID"
                                        label="Player ID"
                                        onChange={(value: number) => setNewAccess(value)}

                                        min={0}
                                        max={10000}
                                    />
                                    <Button color='green' size="xs" variant="light" leftIcon={<IconPlus size={15} />} onClick={addAccess}>
                                        Add Access
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
                            <Text size={25}>Vehicles</Text>
                            <Table highlightOnHover>
                                <thead>
                                    <tr>
                                        <th>Slot</th>
                                        <th>Vehicle</th>
                                        <th>Plate</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                            </Table>
                            <ScrollArea.Autosize mah={300} p={10} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} scrollbarSize={10}>
                                <Table highlightOnHover striped   >
                                    <tbody>
                                        {dataPrivate.garage?.slots.map((slot: any, index: number) => (
                                            <tr key={index}>
                                                <td>Slot {index + 1}</td>
                                                <td>{slot.busy ? (slot.vehname || 'Unknown') : '-'}</td>
                                                <td>{slot.busy ? (<Badge radius={5}>{slot.plate}</Badge>) : '-'}</td>
                                                <td>
                                                    {slot.busy ? (
                                                        <Group position="center">
                                                            <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={200} color='teal'  label={`Access`} transitionProps={{ transition: 'skew-down', duration: 300 }} withArrow>
                                                                <ActionIcon disabled={slot.isOwner === true} color='green' variant="light">
                                                                    <IconUsers size={15} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={200} color='yellow' label={`Give Key`} transitionProps={{ transition: 'skew-down', duration: 300 }} withArrow>
                                                                <ActionIcon disabled={slot.isOwner === true} color='yellow' variant="light">
                                                                    <IconKey size={15} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ScrollArea.Autosize>
                        </Paper>
                    </Tabs.Panel>


                </Tabs>








            </div>}
        </Transition>
    );
};

export default PrivateGarages;
