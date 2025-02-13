import React, { useState } from "react";
import { fetchNui } from "../../utils/fetchNui";
import { SimpleGrid, TextInput, Checkbox, Button, Text, Select, MultiSelect, Space, Stack, Paper, NumberInput, Group, ScrollArea, ActionIcon, Header, Badge, Divider, Flex, Card, Tooltip } from '@mantine/core';
import { IconCarCrash, IconDatabase, IconDeviceFloppy, IconMapPin, IconMapPinShare, IconPlus, IconTrash } from '@tabler/icons-react';
import { useLang } from "../../utils/LangContext";
import VehicleType from "./typeSelect";
import VehicleForm from "./customVehicles";
import TooltipActionIcon from "./aitt";



type GarageType = "garage" | "impound" | "custom";

interface Garage {
    id: number;
    name: string;
    garagetype: GarageType;
}

interface Zones {
    data: any;
    setGaragesData: any;
}
const GaragesZones: React.FC<Zones> = ({ data, setGaragesData }) => {
    const [newVehicle, setNewVehicle] = useState<any>({ model: '', grades: [] });
    const [filter, setFilter] = useState({ garage: false, impound: false, custom: false });
    const [search, setSearch] = useState("");
    const lang = useLang()

    const handleChange = (index: number, property: string, value: any) => {
        const newData = [...data];
        newData[index][property] = value;
        setGaragesData(newData);
    };

    const handleDelete = (index: number) => {
        fetchNui('mGarage:adm', { action: 'delete', data: data[index] });
    };

    const handleUpdate = (index: number) => {
        fetchNui('mGarage:adm', { action: 'update', data: data[index] });
    };

    const handleTeleport = (index: number) => {
        fetchNui('mGarage:adm', { action: 'teleport', data: data[index] });
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

    const handleAddVehicle = (index: number) => {
        const updatedGaragesData = [...data];
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
        const updatedGaragesData = [...data];
        updatedGaragesData[garageIndex].defaultCars.splice(vehicleIndex, 1);
        setGaragesData(updatedGaragesData);
    };

    const Grades = Array(51).fill(0).map((_, index) => ({
        label: `Grade ${index}`,
        value: index.toString()
    }));


    const handleFilterChange = (type: GarageType) => {
        setFilter((prev) => ({ ...prev, [type]: !prev[type] }));
    };


    const filteredGarages = data.filter((garage: Garage) => {
        const matchesId = search ? garage.id.toString().includes(search) : true;
        const matchesName = search ? garage.name.toLowerCase().includes(search.toLowerCase()) : true;
        const matchesType = filter[garage.garagetype] || Object.values(filter).every(value => value === false);
        return matchesType && (matchesName || matchesId);
    });



    return (
        <>
            <Group position="apart">
                <Group>
                    <Text>Filter type</Text>
                    <Checkbox
                        label="Garages"
                        color="green"
                        checked={filter.garage}
                        onChange={() => handleFilterChange("garage")}
                    />
                    <Checkbox
                        label="Impound"
                        color="green"
                        checked={filter.impound}
                        onChange={() => handleFilterChange("impound")}
                    />
                    <Checkbox
                        label="Custom"
                        color="green"
                        checked={filter.custom}
                        onChange={() => handleFilterChange("custom")}
                    />
                </Group>
                <Text>Total Garages: {filteredGarages.length}</Text>
                <TextInput
                    size="xs"
                    placeholder="Garage name / ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Group>
            <Space my={5} />
            <ScrollArea scrollbarSize={0} h={565} >
                <Stack spacing={5}>
                    {filteredGarages.map((garage: any, index: number) => (
                        <Paper p={10} color="dark" withBorder>
                            <Group position="apart">
                                <Group spacing={5}>
                                    <Badge radius={3} color="green">#{garage.id}</Badge>
                                    <Badge radius={3} color="yellow">{garage.garagetype}</Badge>
                                </Group>

                                <Text size={26} >{garage.name}</Text>

                                <Group spacing={5}>
                                    <TooltipActionIcon
                                        label={lang.GarageButton5}
                                        color="teal"
                                        IconComponent={IconMapPinShare}
                                        onClick={() => handleTeleport(index)}
                                    />
                                    <TooltipActionIcon
                                        label={`#${garage.id} ${lang.GarageButton6}`}
                                        color="teal"
                                        IconComponent={IconDeviceFloppy}
                                        onClick={() => handleUpdate(index)}
                                    />
                                    <TooltipActionIcon
                                        label={`#${garage.id} ${lang.GarageButton7}`}
                                        color="red"
                                        IconComponent={IconTrash}
                                        onClick={() => handleDelete(index)}
                                    />
                                </Group>

                            </Group>
                            <Divider my={5} />
                            <Stack spacing={5}>
                                <SimpleGrid cols={3}>
                                    <TextInput
                                        size="xs"
                                        label={lang.GarageJob}
                                        placeholder={garage.job}
                                        description={lang.GarageJobSpan}
                                        defaultValue={garage.job}
                                        onChange={(e) => handleChange(index, "job", e.target.value)}
                                    />

                                    <NumberInput
                                        size="xs"
                                        disabled={garage.garagetype !== 'garage'}
                                        defaultValue={garage.priceImpound}
                                        label={lang.GarageImpound}
                                        placeholder={lang.GarageImpound}
                                        description={lang.GarageImpoundSpan}
                                        onChange={(values) => handleChange(index, "priceImpound", values)}
                                    />


                                    <TextInput
                                        size="xs"
                                        disabled={garage.garagetype !== 'impound'}
                                        label={lang.GarageSociety}
                                        placeholder={lang.GarageSociety}
                                        defaultValue={garage.society}
                                        description={lang.GarageSocietySpan}
                                        onChange={(e) => handleChange(index, "society", e.target.value)}
                                    />

                                    <NumberInput
                                        size="xs"
                                        disabled={!garage.blip}
                                        defaultValue={garage.blipsprite}
                                        description="number"
                                        label={'Blip Sprite'}
                                        onChange={(values) => handleChange(index, "blipsprite", values)}
                                    />
                                    <NumberInput
                                        size="xs"
                                        disabled={!garage.blip}
                                        defaultValue={garage.blipcolor}
                                        description="number"
                                        label={'Blip Color'}
                                        onChange={(values) => handleChange(index, "blipcolor", values)}
                                    />


                                    <VehicleType
                                        onChange={(values) => handleChange(index, "carType", values)}
                                        garageType={garage.carType}
                                    />


                                    <Select
                                        size="xs"
                                        label={lang.GarageActionType}
                                        placeholder={lang.GarageActionType}
                                        defaultValue={garage.zoneType}
                                        description={lang.GarageActionTypeSpan}
                                        dropdownPosition="bottom"
                                        withinPortal={true}
                                        data={[
                                            { value: 'target', label: lang.GarageActionType1 },
                                            { value: 'textui', label: lang.GarageActionType2 },
                                            { value: 'radial', label: lang.GarageActionType3 },
                                        ]}
                                        onChange={(values) => handleChange(index, "zoneType", values)}
                                    />

                                    <TextInput
                                        size="xs"
                                        disabled={garage.zoneType !== 'target'}
                                        label={lang.GarageNPC}
                                        placeholder={lang.GarageNPC}
                                        defaultValue={garage.npchash}
                                        description={lang.GarageNPCSpan}
                                        onChange={(e) => handleChange(index, "npchash", e.target.value)}
                                    />

                                    <Checkbox
                                        color="green"
                                        label={lang.GarageInTocar}
                                        checked={garage.intocar}
                                        description={lang.GarageInTocarSpan}
                                        onChange={(e) => handleChange(index, "intocar", e.target.checked)}
                                    />
                                    <Checkbox
                                        color="green"
                                        label={lang.GarageDebug}
                                        checked={garage.debug}
                                        description={lang.GarageDebugSpan}
                                        onChange={(e) => handleChange(index, "debug", e.target.checked)}
                                    />
                                    <Checkbox
                                        color="green"
                                        label={lang.GarageBlip}
                                        checked={garage.blip}
                                        description={lang.GarageBlipSpan}
                                        onChange={(e) => handleChange(index, "blip", e.target.checked)}
                                    />
                                    <Checkbox
                                        color="green"
                                        label={lang.GarageSharedVehicles}
                                        checked={garage.isShared}
                                        description={lang.GarageSharedVehiclesSpan}
                                        onChange={(e) => handleChange(index, "isShared", e.target.checked)}
                                    />

                                </SimpleGrid >
                                {garage.garagetype === 'custom' && (
                                    <VehicleForm
                                        platePrefix={garage.platePrefix}
                                        setPlatePrefix={(value) => handleChange(index, 'platePrefix', value)}
                                        newVehicle={newVehicle}
                                        setNewVehicle={setNewVehicle}
                                        Grades={Grades}
                                        handleAddVehicle={() => handleAddVehicle(index)}
                                        handleDeleteVehicle={(vehicleIndex) => handleDeleteVehicleCustom(index, vehicleIndex)}
                                        defaultCars={garage.defaultCars}
                                    />



                                )}
                                <Group grow>
                                    <Button onClick={() => handleCoordsGarage(index)} variant="light" size='xs' leftIcon={<IconMapPin size="1rem" />}>
                                        {lang.GarageButton1}
                                    </Button>
                                    <Button onClick={() => handleSpawnCoords(index)} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                                        {lang.GarageButton3}
                                    </Button>
                                </Group>

                            </Stack>
                        </Paper >


                    ))}
                </Stack>
            </ScrollArea>
        </>
    );
};

export default GaragesZones;
