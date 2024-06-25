import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import SearchBox from "./lit/search";
import { Accordion, Center, CloseButton, ScrollArea, Transition, createStyles, rem } from '@mantine/core';
import Vehicles from "./vehicle";
import './index.scss'

const useStyles = createStyles((theme) => ({
    root: {
        padding: 0,
    },

    item: {
        padding: 5,
        backgroundColor: '#1A1B1E',
        borderRadius: 10,
        marginBottom: '5px',

        '&[data-active]': {
            backgroundColor: '#1A1B1E',
        },
    },

    content: {
        padding: 0
    },

    label: {
        padding: 7,
    },

    chevron: {
        '&[data-rotate]': {
            transform: 'rotate(-90deg)',

        },
    },
}));


const Garage: React.FC<{ visible: boolean }> = ({ visible }) => {

    const [dataGarage, GarageData] = useState<any>({});
    const [vehiclesData, setVehicleData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    useNuiEvent<any>('garage', (data) => {
        GarageData(data.garage);
        setVehicleData(data.vehicles);
    });

    const handleClose = async () => {
        setActiveAccordion(null);
        fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
    };
    const keyHandler = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
            setActiveAccordion(null);
        }
    }
    window.addEventListener('keydown', keyHandler);

    const filteredVehicles = vehiclesData.filter((vehicle) =>
        (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vehicle.vehlabel && vehicle.vehlabel.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const { classes } = useStyles();

    return (
        <Transition mounted={visible} transition="slide-left" duration={600} timingFunction="ease">
            {(styles) => <div style={styles} className="Garage">
              
                    <div className="Garage-head">
                        <div className="name">{dataGarage.name}</div>
                        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <CloseButton radius={10} size={'md'} onClick={handleClose} color="red" variant="light" />
                    </div>

                    <ScrollArea.Autosize mah={440} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} scrollbarSize={0}>
                        {filteredVehicles.length > 0 ? (
                            <Accordion
                                variant="filled"
                                defaultValue="customization"
                                classNames={classes}
                                className={classes.root}
                                transitionDuration={500}
                                mah={490}
                                value={activeAccordion}
                                onChange={setActiveAccordion}

                            >
                                {filteredVehicles.map((vehicle, index) => (
                                    <Vehicles
                                        key={index}
                                        index={index}
                                        vehicle={vehicle}
                                        garage={dataGarage}
                                        Close={handleClose}

                                    />
                                ))}
                            </Accordion>
                        ) : (
                            <Center h={100} mx="auto" sx={{ backgroundColor: '#1A1B1E' }}>
                                <div>😢</div>
                            </Center>
                        )}
                    </ScrollArea.Autosize>
             
            </div>}

        </Transition>
    );
};

export default Garage;