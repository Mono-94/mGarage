import React from 'react';
import { SimpleGrid, TextInput, MultiSelect, Paper, Group, ScrollArea, ActionIcon, Divider, Badge, Card, Text, Stack, UnstyledButton } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useLang } from "../../utils/LangContext";

interface Form {
  form?: any;
  newVehicle: any;
  setNewVehicle: React.Dispatch<React.SetStateAction<any>>;
  Grades: { value: string; label: string }[];
  handleAddVehicle: () => void;
  handleDeleteVehicle: (index: number) => void;
  platePrefix?: string;
  setPlatePrefix?: (value: string) => void;
  defaultCars?: any[];
}

const VehicleForm: React.FC<Form> = ({
  form,
  newVehicle,
  setNewVehicle,
  Grades,
  handleAddVehicle,
  handleDeleteVehicle,
  platePrefix,
  setPlatePrefix,
  defaultCars = [],
}) => {
  const lang = useLang();

  const handlePlatePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (form) {
      form.setFieldValue('platePrefix', e.target.value);
    } else if (setPlatePrefix) {
      setPlatePrefix(e.target.value);
    }
  };

  const getPlatePrefixValue = () => {
    if (form) {
      return form.values.platePrefix;
    }
    return platePrefix || '';
  };

  const getDefaultCars = () => {
    if (form) {
      return form.values.defaultCars;
    }
    return defaultCars;
  };

  return (
    <Card p={5} withBorder>
      <Text size={20}>Custom garage</Text>
      <Divider my={5} />
      <Group spacing={5}>
        <Stack h={230} w={200}>
          <TextInput
            size="xs"
            label={lang.GarageMenu13}
            description={lang.GarageMenu14}
            value={getPlatePrefixValue()}
            maxLength={4}
            onChange={handlePlatePrefixChange}
            variant="filled"
            styles={(theme) => ({ input: { borderColor: theme.colors.dark[4] } })}
          />
          <TextInput
            size="xs"
            label={lang.GarageMenu15}
            value={newVehicle.model}
            max={4}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            rightSection={
              <ActionIcon p={5} onClick={handleAddVehicle} size={21} variant="light" color="green">
                <IconPlus />
              </ActionIcon>
            }
            variant="filled"
            styles={(theme) => ({ input: { borderColor: theme.colors.dark[4] } })}
          />

          <MultiSelect
            size="xs"
            data={Grades}
            label={lang.GarageMenu17}
            maxDropdownHeight={200}
            dropdownPosition="top"
            withinPortal
            value={newVehicle.grades}
            onChange={(value) => setNewVehicle({ ...newVehicle, grades: value })}
            variant="filled"
            styles={(theme) => ({ input: { borderColor: theme.colors.dark[4] } })}
          />

        </Stack>
        <Stack w={620} h={230}>
          <ScrollArea h={230} w={654} scrollbarSize={3}>
            <SimpleGrid cols={2} spacing={4}>
              {getDefaultCars().map((vehicle: any, index: number) => (
                <Card withBorder key={`vehicle-${index}`} p={4} style={{ backgroundColor: '#2e3036' }}>

                  <Group>
                    <ActionIcon size={40} color="red" variant="light">
                      <IconTrash onClick={() => handleDeleteVehicle(index)} />
                    </ActionIcon>
                    <div>
                      <Text>Model: {vehicle.model}</Text>
                      {vehicle.grades && (
                        <Text size="xs" color="dimmed"> Grades {vehicle.grades.join(', ')}</Text>
                      )}
                    </div>
                  </Group>



                </Card>
              ))}
            </SimpleGrid>
          </ScrollArea>
        </Stack>
      </Group>
    </Card>
  );
};

export default VehicleForm;
