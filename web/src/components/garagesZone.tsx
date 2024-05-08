import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { SimpleGrid, TextInput, Checkbox, Button, Text, Select, MultiSelect, Space, Stack, Paper, NumberInput } from '@mantine/core';
import Lang from "../utils/LangR";
import { IconCarCrash, IconDatabase, IconMapPin, IconMapPinShare, IconTrash } from '@tabler/icons-react';


const GaragesZones: React.FC = () => {
    const [garagesData, setGaragesData] = useState<any[]>([]);

    const lang = Lang()

    useNuiEvent<any[]>('GarageZones', (data) => {
        setGaragesData(data);
    });

    const handleChange = (index: number, property: string, value: any) => {
        const newData = [...garagesData];
        newData[index][property] = value;
        setGaragesData(newData);
    };

    const handleDelete = async (index: number) => {
        const fetchResult = await fetchNui('mGarage:adm', { action: 'delete', data: garagesData[index] });
        if (fetchResult) {
            const newData = [...garagesData];
            newData.splice(index, 1);
            setGaragesData(newData);
        }
    };
    const handleUpdate = (index: number) => {
        fetchNui('mGarage:adm', { action: 'update', data: garagesData[index] });
    };

    const handleTeleport = (index: number) => {
        fetchNui('mGarage:adm', { action: 'teleport', data: garagesData[index] });
    };
    const handleCoordsGarage = async (index: number) => {
        const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'coords', data: false })
        if (fetchResult) {
            handleChange(index, "actioncoords", fetchResult)
        }
    };
    const handleSpawnCoords = async (index: number) => {
        const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'spawn_coords', data: false })
        if (fetchResult) {
            handleChange(index, "spawnpos", fetchResult)
        }
    };
    return (
        <Paper>
            {garagesData.map((garage: any, index: number) => (
                !garage.default && (
                    <Paper p="xs" style={{ backgroundColor: '#2e3036', margin: '5px 0' }}>
                        <Text fz="xl">{garage.name}</Text>
                        <Space h="md" />
                        <Stack>
                            {garage.garagetype === 'impound' && (
                                <NumberInput
                                    defaultValue={18}
                                    disabled
                                    label={lang.GarageImpound}
                                    placeholder={lang.GarageImpound}
                                    description={lang.GarageImpoundSpan}
                                    onChange={(values) => handleChange(index, "priceImpound", values)}
                                />
                            )}
                            <SimpleGrid cols={2}>
                                <Checkbox
                                    label={lang.GarageInTocar}
                                    checked={garage.intocar}
                                    description={lang.GarageInTocarSpan}
                                    onChange={(e) => handleChange(index, "intocar", e.target.checked)}
                                />
                                <Checkbox
                                    label={lang.GarageDebug}
                                    checked={garage.debug}
                                    description={lang.GarageDebugSpan}
                                    onChange={(e) => handleChange(index, "debug", e.target.checked)}
                                />
                                <Checkbox
                                    label={lang.GarageBlip}
                                    checked={garage.blip}
                                    description={lang.GarageBlipSpan}
                                    onChange={(e) => handleChange(index, "blip", e.target.checked)}
                                />
                                <Checkbox
                                    label={lang.GarageSharedVehicles}
                                    checked={garage.isShared}
                                    description={lang.GarageSharedVehiclesSpan}
                                    onChange={(e) => handleChange(index, "isShared", e.target.checked)}
                                />
                            </SimpleGrid>
                            {garage.blip && (
                                <SimpleGrid cols={2}>
                                    <NumberInput
                                        defaultValue={garage.blipsprite | 50}
                                        label={'Blip Sprite'}
                                        onChange={(values) => handleChange(index, "blipsprite", values)}
                                    />
                                    <NumberInput
                                        defaultValue={garage.blipsprite | 0}
                                        label={'Blip Color'}
                                        onChange={(values) => handleChange(index, "blipcolor", values)}
                                    />
                                </SimpleGrid>
                            )}
                            <MultiSelect
                                label={lang.GarageVehicleType}
                                placeholder={lang.GarageVehicleTypeSpan}
                                defaultValue={garage.carType}
                                description={lang.GarageVehicleTypeSpan}
                                dropdownPosition="bottom"
                                data={[
                                    { value: 'automobile', label: 'Automobile' },
                                    { value: 'bicycle', label: 'Bicycle' },
                                    { value: 'bike', label: 'Bike' },
                                    { value: 'blimp', label: 'Blimp' },
                                    { value: 'boat', label: 'Boat' },
                                    { value: 'heli', label: 'Heli' },
                                    { value: 'plane', label: 'Plane' },
                                    { value: 'quadbike', label: 'Quadbike' },
                                    { value: 'submarine', label: 'Submarine' },
                                    { value: 'submarinecar', label: 'Submarinecar' },
                                    { value: 'trailer', label: 'Trailer' },
                                    { value: 'train', label: 'Train' },
                                    { value: 'amphibious_quadbike', label: 'Amphibious Quadbike' },
                                    { value: 'amphibious_automobile', label: 'Amphibious Automobile' },
                                ]}
                                onChange={(values) => handleChange(index, "carType", values)}
                            />

                            <Select
                                label={lang.GarageActionType}
                                placeholder={lang.GarageActionType}
                                defaultValue={garage.zoneType}
                                description={lang.GarageActionTypeSpan}
                                data={[
                                    { value: 'target', label: lang.GarageActionType1 },
                                    { value: 'textui', label: lang.GarageActionType2 },

                                ]}
                                onChange={(values) => handleChange(index, "zoneType", values)}

                            />

                            {garage.zoneType === 'target' && (
                                <TextInput
                                    label={lang.GarageNPC}
                                    placeholder={lang.GarageNPC}
                                    defaultValue={garage.npchash}
                                    description={lang.GarageNPCSpan}
                                    onChange={(values) => handleChange(index, "npchash", values)}
                                />
                            )}

                            <Button.Group>
                                <Button fullWidth onClick={() => handleCoordsGarage(index)} variant="light" size='xs' leftIcon={<IconMapPin size="1rem" />}>
                                {lang.GarageButton1}
                                </Button>
                                <Button fullWidth onClick={() => handleSpawnCoords(index)} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                                {lang.GarageButton3}
                                </Button>
                            </Button.Group>
                            <Button.Group>
                                <Button fullWidth variant="light" size='xs' color="teal" leftIcon={<IconMapPinShare size="1rem" />} onClick={() => handleTeleport(index)}  >
                                {lang.GarageButton5}
                                </Button>
                                <Button fullWidth variant="light" size='xs' color="yellow" leftIcon={<IconDatabase size="1rem" />} onClick={() => handleUpdate(index)}  >
                                {lang.GarageButton6}
                                </Button>

                                <Button fullWidth variant="light" size='xs' color="red" leftIcon={<IconTrash size="1rem" />} onClick={() => handleDelete(index)} >
                                {lang.GarageButton7}
                                </Button>
                            </Button.Group>
                        </Stack>

                    </Paper>
                )
            ))
            }
        </Paper>
    );
};

export default GaragesZones;
