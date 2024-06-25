
import React, { useState, } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import Create from "./Create";
import Garage from "./garagesZone"
import Lang from '../utils/LangR';
import { Tabs, Paper, ScrollArea, CloseButton } from '@mantine/core';
import { IconList, IconPlus } from '@tabler/icons-react';


const Menu: React.FC<{ visible: boolean }> = ({ visible }) => {
    
    const [garages, setGarageData] = useState<any[]>([]);

    const lang = Lang();

    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
    };

    useNuiEvent<any[]>('GarageZones', (data) => { setGarageData(data); });

    return (
        <Paper className={`menu ${visible ? 'slide-in' : 'slide-out'}`} p={10}>
            <Tabs color="gray" variant="pills" defaultValue="create">
                <Tabs.List >
                    <Tabs.Tab value="create" icon={<IconPlus size="0.8rem" />}>{lang.GarageButton4}</Tabs.Tab>
                    <Tabs.Tab value="garages" icon={<IconList size="0.8rem" />}>{lang.GarageButton8}</Tabs.Tab>
                    <Tabs.Tab value="impounds" icon={<IconList size="0.8rem" />}>{'Impound List'}</Tabs.Tab>
                    <Tabs.Tab value="customs" icon={<IconList size="0.8rem" />}>{'Customs List'}</Tabs.Tab>
                    <CloseButton radius={10} size={'md'} onClick={handleClose} color="red" variant="light" style={{ marginLeft: 'auto' }} />
                </Tabs.List>

                <ScrollArea.Autosize mih={800} mah={800} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>

                    <Tabs.Panel value="create" sx={{ marginTop: 10 }}>
                        <Create />
                    </Tabs.Panel>

                    <Tabs.Panel value="garages" sx={{ marginTop: 10 }}>
                        <Garage zone='garage' />
                    </Tabs.Panel>

                    <Tabs.Panel value="impounds" sx={{ marginTop: 10 }}>
                        <Garage zone='impound' />
                    </Tabs.Panel>

                    <Tabs.Panel value="customs" sx={{ marginTop: 10 }}>
                        <Garage zone='custom' />
                    </Tabs.Panel>
                </ScrollArea.Autosize>
            </Tabs>
        </Paper>
    )
};

export default Menu;



