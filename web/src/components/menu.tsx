
import React, { useState, } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import Create from "./Create";
import Garage from "./garagesZone"
import Lang from '../utils/LangR';
import { Tabs, Paper, ScrollArea, CloseButton } from '@mantine/core';
import { IconList, IconPlus } from '@tabler/icons-react';


const Menu: React.FC<{ visible: boolean }> = ({ visible }) =>{
    
    const [garages, setGarageData] = useState<any[]>([]);

    const lang = Lang();

    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
    };

    useNuiEvent<any[]>('GarageZones', (data) => { setGarageData(data); });

    return (
        <Paper className={`menu ${visible ? 'slide-in' : 'slide-out'}`}>
            <Tabs variant="outline" defaultValue="create">
                <Tabs.List >
                    <Tabs.Tab value="create" icon={<IconPlus size="0.8rem" />}>{lang.GarageButton4}</Tabs.Tab>
                    <Tabs.Tab value="garages" icon={<IconList size="0.8rem" />}>{lang.GarageButton8}</Tabs.Tab>
                    <Tabs.Tab value="impounds" icon={<IconList size="0.8rem" />}>{'Impound List'}</Tabs.Tab>
                    <Tabs.Tab value="customs" icon={<IconList size="0.8rem" />}>{'Customs List'}</Tabs.Tab>
                    <CloseButton size="md" onClick={handleClose} color="red" ml='auto' />
                </Tabs.List>
                <ScrollArea.Autosize mih={800} mah={800} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>

                    <Tabs.Panel value="create" sx={{ padding: 5 }}>
                        <Create />
                    </Tabs.Panel>

                    <Tabs.Panel value="garages" sx={{ padding: 5 }}>
                        <Garage zone='garage' />
                    </Tabs.Panel>

                    <Tabs.Panel value="impounds" sx={{ padding: 5 }}>
                        <Garage zone='impound' />
                    </Tabs.Panel>

                    <Tabs.Panel value="customs" sx={{ padding: 5 }}>
                        <Garage zone='custom' />
                    </Tabs.Panel>
                </ScrollArea.Autosize>
            </Tabs>
        </Paper>
    )
};

export default Menu;



