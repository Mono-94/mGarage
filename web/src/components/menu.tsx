
import React, { useState, } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import Create from "./Create";
import Garage from "./garagesZone"
import Lang from '../utils/LangR';
import { Tabs, Paper, ScrollArea, CloseButton } from '@mantine/core';
import { IconList, IconPlus } from '@tabler/icons-react';


const Menu: React.FC = () => {
    const [garages, setGarageData] = useState<any[]>([]);
    const lang = Lang();

    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
    };

    useNuiEvent<any[]>('GarageZones', (data) => { setGarageData(data); });

    return (
        <Paper p='xs'   style={{
            width: 'auto',
            height: 'auto',
            maxHeight: '100vh',
            position: 'fixed',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
        }}>
            <Tabs variant="outline" defaultValue="create">
                <Tabs.List >
                    <Tabs.Tab value="create" icon={<IconPlus size="0.8rem" />}>{lang.GarageButton4}</Tabs.Tab>
                    <Tabs.Tab value="garages" icon={<IconList size="0.8rem" />}>{lang.GarageButton8}</Tabs.Tab>
                    <CloseButton size="md" onClick={handleClose} color="red" ml='auto' />
                </Tabs.List>
                <ScrollArea h={'90vh'} w={'400px'} type="scroll" scrollHideDelay={2000} >

                    <Tabs.Panel value="create" >
                        <Create />
                    </Tabs.Panel>

                    <Tabs.Panel value="garages" sx={{ padding: 5 }}>
                        <Garage />
                    </Tabs.Panel>

                </ScrollArea>
            </Tabs>
        </Paper>
    )
};

export default Menu;



