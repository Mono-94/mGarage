import React, { useEffect, useState, useRef } from "react";
import { fetchNui } from "../../utils/fetchNui";
import Create from "./Create";
import Garage from "./garagesZone";
import { useLang } from '../../utils/LangContext';
import { Tabs, Paper, ScrollArea, CloseButton, Group, Text, Divider, Button, ActionIcon, Kbd, Badge, Transition, Stack, Box, NavLink, Card } from '@mantine/core';
import { IconList, IconPlus, IconArrowDownCircle, IconArrowUpCircle } from '@tabler/icons-react';
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { isEnvBrowser } from "../../utils/misc";
import "./style.scss"
interface MenuProps {
    visible: boolean;
}
const Menu: React.FC<MenuProps> = ({ visible }) => {
    const [action, setAction] = useState<any>('');
    const [isMinimized, setIsMinimized] = useState(false);
    const lang = useLang();
    const [garagesData, setGaragesData] = useState<any>([]);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClose = async () => {
        fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
    };

    useNuiEvent<any>('GarageZones', (data) => {
        setGaragesData(data);
    });


    useNuiEvent<{ minimized: boolean, action: string }>('minimizeMenu', (data) => {
        setAction(data.action)
        setIsMinimized(data.minimized);
    });

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const Leyenda = () => {
        return (<>
            {isEnvBrowser() && visible && (
                <ActionIcon radius={7} variant="default" onClick={handleMinimize} >
                    {isMinimized ? <IconArrowUpCircle size="1rem" /> : <IconArrowDownCircle size="1rem" />}
                </ActionIcon>
            )}
        </>)
    }

    const renderLegend = (text: string) => {
        return text.split('\n').map((line, index) => {
            const parts = line.trim().split(' ');
            return (
                <Stack key={index} spacing={3} style={{ fontSize: 13 }} align="center">
                    {parts.map((part, idx) => {
                        if (part.startsWith('[') && part.endsWith(']')) {
                            const key = part.substring(1, part.length - 1);
                            return (
                                <div>
                                    <Kbd size={'sm'}>{key}</Kbd>
                                    {idx !== parts.length - 1 && ' '}
                                </div>
                            );
                        }
                        return part + ' ';
                    })}
                </Stack>
            );
        });
    };


    return (
        <>
            {Leyenda()}
            <Transition mounted={visible} transition="pop-top-right" duration={400} timingFunction="ease" keepMounted={false}>
                {(styles) =>

                    <div style={{ ...styles }} className="createmenu">

                        <Card
                            className="cm"
                            style={{ height: isMinimized ? '65px' : '700px', width: isMinimized ? '1000px' : '900px' }}
                            p={5}
                        >

                            {isMinimized && (<Group position="apart" p={10}>
                                {action === 'zone' && renderLegend(lang.TextUiCreateZone)}
                                {action === 'coords' && renderLegend(lang.TextUiCoords)}
                            </Group>)}

                            <Tabs defaultValue="create" variant="pills" color="dark" >


                                <Group position="apart">
                                    <Text size={20}>mGarage</Text>
                                    <CloseButton radius={7} size={'md'} onClick={handleClose} color="red" variant="light" />
                                </Group>

                                <Divider my={5} />

                                <Tabs.List position="center" grow>
                                    <Tabs.Tab value="create" icon={<IconPlus size="0.8rem" />}>{lang.GarageButton4}</Tabs.Tab>
                                    <Tabs.Tab value="garages" icon={<IconList size="0.8rem" />}>{lang.GarageButton8}</Tabs.Tab>
                                </Tabs.List>

                                <Divider my={5} />
                                <Tabs.Panel value="create">
                                    <ScrollArea h={600} scrollbarSize={0}>
                                        <Create />
                                    </ScrollArea>
                                </Tabs.Panel>
                                <Tabs.Panel value="garages" >
                                    <Garage data={garagesData} setGaragesData={setGaragesData} />
                                </Tabs.Panel>

                            </Tabs>

                        </Card>

                    </div>
                }
            </Transition>
        </>
    );
};

export default Menu;
