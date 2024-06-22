import React, { useState } from 'react';
import { Modal, Text, Group, TextInput, Button } from '@mantine/core';

interface AuthModalProps {
    opened: boolean;
    close: () => void;
    vehicleLabel: string;
    onChangeName: (newName: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ opened, close, vehicleLabel, onChangeName }) => {
    const [newName, setNewName] = useState('');

    const handleChangeName = () => {
        onChangeName(newName);
        close();
    };

    return (
        <Modal opened={opened} onClose={close} title="New Name" centered size="xs" radius={10} yOffset={10}>
            <Group align="flex-end">
                <TextInput
                    data-autofocus
                    placeholder={vehicleLabel}
                    value={newName}
                    onChange={(e) => setNewName(e.currentTarget.value)}
                    sx={{ flex: 1 }}
                />
                <Button variant="light" onClick={handleChangeName}>
                    Change
                </Button>
            </Group>
        </Modal>
    );
};

export default AuthModal;
