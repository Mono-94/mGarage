import React, { useState } from "react";
import { SimpleGrid, TextInput, Checkbox, Button, Select, MultiSelect, Text, Stack, NumberInput, Paper, Group, ScrollArea, ActionIcon, Divider, Space, Header, Badge, JsonInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchNui } from "../../utils/fetchNui";
import { useLang } from "../../utils/LangContext";
import { IconCarCrash, IconDatabase, IconMapPin, IconPlus, IconTrash } from "@tabler/icons-react";
import VehicleType from "./typeSelect";
import VehicleForm from "./customVehicles";


interface Coords {
   x: number;
   y: number;
   z: number;
   w: number;
}

const Create: React.FC = ({ }) => {
   const lang = useLang()
   const [newVehicle, setNewVehicle] = useState<any>({ model: '', grades: [] });

   const form = useForm({
      initialValues: {
         name: "" as string,
         npchash: "csb_trafficwarden" as string,
         job: "",
         garagetype: "" as string,
         zoneType: "" as string,
         society: "" as string,
         platePrefix: "" as string,
         blipsprite: 50 as number,
         blipcolor: 0 as number,
         thickness: 0 as number,
         actioncoords: {} as Coords,
         defaultCars: [] as { model: string; grades?: string[] }[],
         carType: [],
         points: [],
         spawnpos: [],
         intocar: false as boolean,
         blip: true as boolean,
         prop: false as boolean,
         debug: false as boolean,
         isShared: false as boolean,
      },

      validate: {
         name: (value) => (value.trim() ? null : 'Required'),
         garagetype: (value) => (value ? null : 'Required'),
         zoneType: (value) => (value ? null : 'Required'),
         carType: (value, values) => {
            if (values.garagetype === 'custom') {
               return null; 
            }
            return value.length > 0 ? null : 'Required';
         },
         points: (value) => (value.length > 0 ? null : 'Required'),
         spawnpos: (value) => (value.length > 0 ? null : 'Required'),
         actioncoords: (value) => {
            if (!value || typeof value !== 'object') {
               return 'Required';
            }
            const hasValidProps =
               typeof value.x === 'number' &&
               typeof value.y === 'number' &&
               typeof value.z === 'number' &&
               typeof value.w === 'number';

            return hasValidProps ? null : 'Required';
         },
      },
   });




   const handleAddVehicle = () => {
      const { model, grades } = newVehicle;
      if (!model) {
         return;
      }

      const newCar: { model: string; grades?: string[] } = { model: model };
      if (form.values.job !== '' && grades.length > 0) {
         newCar.grades = grades;
      }

      form.setFieldValue('defaultCars', [
         ...form.values.defaultCars,
         newCar
      ]);

      setNewVehicle({
         model: '',
         grades: [],
      });
   };

   const handleDeleteVehicle = (index: number) => {
      const updatedCars = form.values.defaultCars.filter((_, i) => i !== index);
      form.setFieldValue('defaultCars', updatedCars);
   };

   const Grades = Array(51).fill(0).map((_, index) => ({
      label: `Grade ${index}`,
      value: (index).toString()
   }));

   const handleCreateGarage = async () => {
      const fetchResult = await fetchNui('mGarage:adm', { action: 'create', data: form.values });
      return fetchResult;
   };

   const handleZoneGarage = async () => {
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'zone', data: false })
      if (fetchResult) {

         form.setFieldValue('points', fetchResult.points);
         form.setFieldValue('thickness', fetchResult.thickness);
      }
   };

   const handleCoordsGarage = async () => {
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'coords', data: false });

      if (fetchResult) {
         form.setFieldValue('actioncoords', fetchResult);
      }
   };


   const handleSpawnCoords = async () => {
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'spawn_coords', data: false })
      if (fetchResult) {
         form.setFieldValue('spawnpos', fetchResult);
      }
   };

   return (
      <Paper p={10} color="dark" withBorder>

         <form onSubmit={(e) => {
            e.preventDefault();
            form.onSubmit(async (values) => {
               if (form.isValid()) {
                  const success = await handleCreateGarage();
                  if (success) {
                     form.reset();
                  }
               }
            })(e);
         }}>
            <Stack>
               <SimpleGrid cols={3} >

                  <TextInput
                     size="xs"
                     label={lang.GarageName}
                     description={lang.GarageCreateSpan}
                     placeholder={lang.GarageName}
                     {...form.getInputProps('name')}
                  />

                  <Select
                     size="xs"
                     label={lang.GarageType}
                     placeholder={lang.GarageType}
                     description={lang.GarageTypeSpan}
                     dropdownPosition="bottom"
                     withinPortal={true}
                     data={[
                        { value: 'garage', label: lang.GarageType1 },
                        { value: 'impound', label: lang.GarageType2 },
                        { value: 'custom', label: lang.GarageType3 },

                     ]}
                     {...form.getInputProps('garagetype')}
                  />

                  <Select
                     size="xs"
                     label={lang.GarageActionType}
                     placeholder={lang.GarageActionType}
                     description={lang.GarageActionTypeSpan}
                     dropdownPosition="bottom"
                     withinPortal={true}
                     data={[
                        { value: 'target', label: lang.GarageActionType1 },
                        { value: 'textui', label: lang.GarageActionType2 },
                        { value: 'radial', label: lang.GarageActionType3 },

                     ]}
                     {...form.getInputProps('zoneType')}
                  />

                  <TextInput
                     size="xs"
                     disabled={form.values.prop === true || form.values.zoneType !== 'target'}
                     label={lang.GarageNPC}
                     placeholder={lang.GarageNPC}
                     description={lang.GarageNPCSpan}
                     defaultValue={form.values.npchash}
                     {...form.getInputProps('npchash')}
                  />



                  <VehicleType
                     form={form}
                     garageType={form.values.carType}
                     disable={form.values.garagetype === 'custom'}
                  />


                  <TextInput
                     size="xs"
                     label={lang.GarageJob}
                     placeholder={lang.GarageJob}
                     description={lang.GarageJobSpan}
                     {...form.getInputProps('job')}
                  />

                  <TextInput
                     size="xs"
                     disabled={form.values.garagetype === 'custom'}
                     label={lang.GarageSociety}
                     placeholder={lang.GarageSociety}
                     description={lang.GarageSocietySpan}
                     {...form.getInputProps('society')}
                  />



                  <NumberInput
                     size="xs"
                     disabled={!form.values.blip}
                     description="number"
                     defaultValue={form.values.blipsprite}
                     label={'Blip Sprite'}
                     {...form.getInputProps('blipsprite')}
                  />
                  <NumberInput
                     size="xs"
                     disabled={!form.values.blip}
                     description="number"
                     defaultValue={1}
                     label={'Blip Color'}
                     {...form.getInputProps('blipcolor')}
                  />



                  <Checkbox
                     size="xs"
                     color="green"
                     label={lang.GarageDebug}
                     description={lang.GarageSocietySpan}
                     {...form.getInputProps('debug')}
                  />
                  {form.values.garagetype === 'garage' && (
                     <Checkbox
                        size="xs"
                        color="green"
                        label={lang.GarageSharedVehicles}
                        description={lang.GarageSharedVehiclesSpan}
                        {...form.getInputProps('isShared')}
                     />
                  )}
                  <Checkbox
                     size="xs"
                     color="green"
                     label={lang.GarageInTocar}
                     description={lang.GarageInTocarSpan}
                     {...form.getInputProps('intocar')}
                  />
                  <Checkbox
                     size="xs"
                     color="green"
                     label={lang.GarageBlip}
                     description={lang.GarageBlipSpan}
                     checked={form.values.blip}
                     {...form.getInputProps('blip')}
                  />
                  {form.values.zoneType === 'target' && (
                     <Checkbox
                        size="xs"
                        color="green"
                        label="Prop"
                        description="Place a prop"
                        checked={form.values.prop}
                        {...form.getInputProps('prop')}
                     />)}
               </SimpleGrid>

               {form.values.garagetype === 'custom' && (
                  <VehicleForm
                     form={form}
                     newVehicle={newVehicle}
                     setNewVehicle={setNewVehicle}
                     Grades={Grades}
                     handleAddVehicle={handleAddVehicle}
                     handleDeleteVehicle={handleDeleteVehicle}
                  />
               )}





               <Group grow>
                  <Stack spacing={0} align="left">
                     <Button fullWidth onClick={() => handleCoordsGarage()} variant="light" size='xs' leftIcon={<IconMapPin size="1rem" />}>
                        {lang.GarageButton1}
                     </Button>
                     {form.errors.actioncoords && <Text fz="xs" c="red">{form.errors.actioncoords}</Text>}
                  </Stack>
                  <Stack spacing={0} align="left">
                     <Button fullWidth onClick={() => handleZoneGarage()} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                        {lang.GarageButton2}
                     </Button>
                     {form.errors.points && <Text fz="xs" c="red">{form.errors.points}</Text>}
                  </Stack>
                  <Stack spacing={0} align="left">
                     <Button fullWidth onClick={() => handleSpawnCoords()} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                        {lang.GarageButton3}
                     </Button>
                     {form.errors.spawnpos && <Text fz="xs" c="red">{form.errors.spawnpos}</Text>}
                  </Stack>
               </Group>
               <Button fullWidth type="submit" variant="light" size='xs' color="teal" leftIcon={<IconDatabase size="1rem" />}>{lang.GarageButton4}</Button>
            </Stack>
         </form>
      </Paper>
   )

};
export default Create;
