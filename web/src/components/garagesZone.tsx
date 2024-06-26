import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { SimpleGrid, TextInput, Checkbox, Button, Text, Select, MultiSelect, Space, Stack, Paper, NumberInput, Group, ScrollArea, ActionIcon, Header, Badge } from '@mantine/core';
import { IconCarCrash, IconDatabase, IconMapPin, IconMapPinShare, IconPlus, IconTrash } from '@tabler/icons-react';
import Lang from "../utils/LangR";

const GaragesZones: React.FC<{ zone: string }> = ({ zone }) => {
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
    const [newVehicle, setNewVehicle] = useState<any>({ model: '', grades: [] });

    const handleAddVehicle = (index: number) => {
        const updatedGaragesData = [...garagesData];
        const { model, grades } = newVehicle;

        if (!model) {
            return;
        }
        const numericGrades = grades.map((grade: string) => Number(grade));

        if (grades.length === 0) {
            updatedGaragesData[index].defaultCars.push({
                model: model
            });
        } else {
            updatedGaragesData[index].defaultCars.push({
                model: model,
                grades: numericGrades,
            });
        }

        setGaragesData(updatedGaragesData);
        setNewVehicle({ model: '', grades: [] });
    };

    const handleDeleteVehicleCustom = (garageIndex: number, vehicleIndex: number) => {
        const updatedGaragesData = [...garagesData];
        updatedGaragesData[garageIndex].defaultCars.splice(vehicleIndex, 1);
        setGaragesData(updatedGaragesData);
    };

    const Grades = Array(51).fill(0).map((_, index) => ({
        label: `Grade ${index}`,
        value: index.toString() 
    }));


    return (
        <>
            {garagesData.map((garage: any, index: number) => (
                !garage.default && zone === garage.garagetype && (
                    <Paper p="xs" style={{ backgroundColor: '#2e3036', margin: '5px 0' }}>
                        <Text fz="xl">#{garage.id} {garage.name}</Text>
                        <Space h="md" />

                        <Stack>
                            <TextInput
                                label={lang.GarageJob}
                                placeholder={garage.job}
                                description={lang.GarageJobSpan}
                                defaultValue={garage.job}
                                onChange={(e) => handleChange(index, "job", e.target.value)}
                            />

                            {garage.garagetype === 'garage' && (
                                <NumberInput
                                    defaultValue={garage.priceImpound}
                                    label={lang.GarageImpound}
                                    placeholder={lang.GarageImpound}
                                    description={lang.GarageImpoundSpan}
                                    onChange={(values) => handleChange(index, "priceImpound", values)}
                                />
                            )}
                            {garage.garagetype === 'impound' && (
                                <TextInput
                                    label={lang.GarageSociety}
                                    placeholder={lang.GarageSociety}
                                    defaultValue={garage.society}
                                    description={lang.GarageSocietySpan}
                                    onChange={(e) => handleChange(index, "society", e.target.value)}
                                />
                            )}

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
                                    { value: 'radial', label: lang.GarageActionType3 },

                                ]}
                                onChange={(values) => handleChange(index, "zoneType", values)}

                            />
                            {garage.zoneType === 'target' && (
                                <TextInput
                                    label={lang.GarageNPC}
                                    placeholder={lang.GarageNPC}
                                    defaultValue={garage.npchash}
                                    description={lang.GarageNPCSpan}
                                    onChange={(e) => handleChange(index, "npchash", e.target.value)}
                                />
                            )}
                            {garage.garagetype === 'custom' && (
                                <Paper p={10}>
                                    <TextInput
                                        label={lang.GarageMenu13}
                                        description={lang.GarageMenu14}
                                        defaultValue={garage.platePrefix}
                                        maxLength={4}
                                        onChange={(e) => handleChange(index, "platePrefix", e.target.value)}
                                    />
                                    <Space h="md" />
                                    <SimpleGrid cols={2}  >
                                        <Stack >
                                            <TextInput
                                                label={lang.GarageMenu15}
                                                value={newVehicle.model}
                                                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                            />

                                            {garage.job !== '' && (
                                                <MultiSelect
                                                    dropdownPosition='bottom'
                                                    data={Grades}
                                                    label={lang.GarageMenu17}
                                                    value={newVehicle.grades}
                                                    onChange={(value) => setNewVehicle({ ...newVehicle, grades: value })}
                                                />
                                            )}
                                            <Button variant="light" size='xs' leftIcon={<IconPlus size="1rem" />} onClick={() => handleAddVehicle(index)}>Add Vehicle</Button>

                                        </Stack>

                                        <ScrollArea.Autosize mah={260} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                            <Stack spacing={5}>
                                                {garage.defaultCars.map((vehicle: any, vehicleIndex: number) => (
                                                    <Paper key={`vehicle-${index}-${vehicleIndex}`} p={4} style={{ backgroundColor: '#2e3036' }}>
                                                        <Header style={{ display: 'flex', justifyContent: 'space-between' }} height={"auto"} p={5}>
                                                            {vehicle.model}
                                                            <ActionIcon variant="default">
                                                                <IconTrash size="1rem" color={'red'} onClick={() => handleDeleteVehicleCustom(index, vehicleIndex)} />
                                                            </ActionIcon>
                                                        </Header>
                                                        <Group spacing="xs">
                                                            {vehicle.grades && <div style={{padding:4}}>Grades  <Badge>  {vehicle.grades.join(', ')}  </Badge></div>}
                                                        </Group>

                                                    </Paper>
                                                ))}
                                            </Stack>
                                        </ScrollArea.Autosize>


                                    </SimpleGrid>
                                </Paper>
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
                                    #{garage.id} {lang.GarageButton5}
                                </Button>
                                <Button fullWidth variant="light" size='xs' color="yellow" leftIcon={<IconDatabase size="1rem" />} onClick={() => handleUpdate(index)}  >
                                    #{garage.id} {lang.GarageButton6}
                                </Button>

                                <Button fullWidth variant="light" size='xs' color="red" leftIcon={<IconTrash size="1rem" />} onClick={() => handleDelete(index)} >
                                    #{garage.id} {lang.GarageButton7}
                                </Button>
                            </Button.Group>
                        </Stack >
                    </Paper >
                )
            ))
            }
        </>
    );
};

export default GaragesZones;
