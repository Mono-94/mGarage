import React, { useState } from 'react';
import { Modal, Group, TextInput, Button, ActionIcon, Tooltip, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useLang } from '../../utils/LangContext';

interface AuthModalProps {
    opened: boolean;
    close: () => void;
    vehicleLabel: string;
    onChangeName: (newName: string) => void;
    onCleanName: () => void;
}

const ChangeName: React.FC<AuthModalProps> = ({ opened, close, vehicleLabel, onChangeName, onCleanName }) => {
    const [newName, setNewName] = useState('');
    const lang = useLang();

    const handleChangeName = () => {
        onChangeName(newName);
        setNewName('');
        close();
    };

    return (

        <Modal opened={opened} onClose={close} title={lang.ui_name2} centered size="xs" radius={10} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Stack spacing={10}>
                <TextInput
                    data-autofocus
                    placeholder={vehicleLabel}
                    value={newName}
                    min={1}
                    max={25}
                    onChange={(e) => setNewName(e.currentTarget.value)}
                />
                <Group position="apart">
                    <Tooltip label="Reset" color="yellow" withinPortal position={'bottom'}>
                        <ActionIcon color='yellow' variant="light" size={"lg"}>
                            <IconTrash size={20} onClick={() => {
                                onCleanName();
                                close();
                            }} />
                        </ActionIcon>
                    </Tooltip>
                    <Button variant="light" color='teal' onClick={handleChangeName}>
                        {lang.ui_name3}
                    </Button>

                </Group>
            </Stack>
        </Modal>


    );
};

export default ChangeName;
