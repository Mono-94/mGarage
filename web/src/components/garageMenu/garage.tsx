import React, { useState } from "react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { fetchNui } from "../../utils/fetchNui";
import { Center, CloseButton, Input, ScrollArea, Group, Stack, createStyles, Text, Divider } from "@mantine/core";
import { IconBan } from "@tabler/icons-react";
import VehCard from "./card";

const Garage: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [dataGarage, setGarageData] = useState<any>({});
    const [vehiclesData, setVehicleData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useNuiEvent<any>("garage", (data) => {
        setGarageData(data.garage);
        setVehicleData(data.vehicles);
    });

    const handleClose = async () => {
        setSearchTerm("");
        fetchNui("mGarage:Close", { name: "setVisibleGarage" });
    };

    const filteredVehicles = vehiclesData
        .sort((a, b) => b.stored - a.stored)
        .filter(
            (vehicle) =>
                (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (vehicle.vehlabel && vehicle.vehlabel.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    return (
        <div className={visible ? "Garage visible" : "Garage no-visible"}>
            <Group position="apart">
                <Text truncate w={300} size={22}> {dataGarage.name} </Text>
                <CloseButton size={30} onClick={handleClose} />
            </Group>


            <Input
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                size="xs"
                placeholder="Search: Plate, model, name..."

            />
            <ScrollArea
                h={500}
                type="scroll"
                scrollHideDelay={500}
                scrollbarSize={0}
            >
                {filteredVehicles.length > 0 ? (
                    <Stack spacing={10}>
                        {filteredVehicles
                            //.filter(vehicle => vehicle.parking === dataGarage.name)
                            .map((vehicle, index) => (
                                <VehCard key={index} index={index} vehicle={vehicle} garage={dataGarage} Close={handleClose} />
                            ))}
                    </Stack>
                ) : (
                    <Center h={"500px"}>
                        <IconBan color="#6fb086" size={350} opacity={0.3} onClick={() => setSearchTerm("")} />
                    </Center>
                )}
            </ScrollArea>
        </div>
    );
};

export default Garage;
