import React, { useState } from 'react';
import { Modal, Text, Group, TextInput, Button } from '@mantine/core';
import Lang from '../../utils/LangR';

interface AuthModalProps {
    opened: boolean;
    close: () => void;
    vehicleLabel: string;
    onChangeName: (newName: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ opened, close, vehicleLabel, onChangeName }) => {
    const [newName, setNewName] = useState('');
    const lang = Lang()

    const handleChangeName = () => {
        onChangeName(newName);
        close();
    };

    return (
        <Modal opened={opened} onClose={close} title={lang.ui_name2} centered size="xs" radius={10} yOffset={10}>
            <Group align="flex-end">
                <TextInput
                    data-autofocus
                    placeholder={vehicleLabel}
                    value={newName}
                    min={1}
                    max={25}
                    onChange={(e) => setNewName(e.currentTarget.value)}
                    sx={{ flex: 1 }}
                />
                <Button variant="light" onClick={handleChangeName}>
                    {lang.ui_name3}
                </Button>
            </Group>
        </Modal>
    );
};

export default AuthModal;
