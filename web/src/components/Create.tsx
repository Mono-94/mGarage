import React, { useState } from "react";
import { SimpleGrid, TextInput, Checkbox, Button, Select, MultiSelect, Stack, NumberInput, Paper, Group, ScrollArea, ActionIcon, Divider, Space, Header, Badge } from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchNui } from "../utils/fetchNui";
import Lang from "../utils/LangR";
import { IconCarCrash, IconDatabase, IconMapPin, IconPlus, IconTrash } from "@tabler/icons-react";




const Create: React.FC = ({ }) => {
   const lang = Lang()

   const form = useForm({
      initialValues: {
         name: "",
         defaultImpound: "",
         npchash: "csb_trafficwarden",
         job: "",
         priceImpound: 100,
         blipsprite: 50,
         blipcolor: 0,
         garagetype: "",
         zoneType: "",
         society: "",
         carType: [],
         intocar: false,
         blip: true,
         points: [],
         thickness: 0,
         actioncoords: [],
         defaultCars: [] as { model: string; grades?: string[] }[],
         platePrefix: '',
         spawnpos: [],
         debug: false,
         defaultGarage: "",
         isShared: false,
      },


      validate: {
         name: (value) => (value.trim() ? null : 'Required'),
         garagetype: (value) => (value ? null : 'Required'),
         zoneType: (value) => (value ? null : 'Required'),
      },
   });


   const [newVehicle, setNewVehicle] = useState<any>({});

   const handleAddVehicle = () => {
      const { model, price, grades } = newVehicle;
      if (!model) {
         return;
      }
      if (price === 0 && grades.length === 0) {
         form.setFieldValue('defaultCars', [
            ...form.values.defaultCars,
            {
               model: model
            }
         ]);

      } else {
         form.setFieldValue('defaultCars', [
            ...form.values.defaultCars,
            {
               model: model,
               grades: grades,
            }
         ]);
      }

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

   const close = () => {
      fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
   }


   const handleCreateGarage = async () => {
      const fetchResult = await fetchNui('mGarage:adm', { action: 'create', data: form.values });
      return fetchResult;
   };

   const handleZoneGarage = async () => {
      close()
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'zone', data: false })
      if (fetchResult) {

         form.setFieldValue('points', fetchResult.points);
         form.setFieldValue('thickness', fetchResult.thickness);
      }
   };

   const handleCoordsGarage = async () => {
      close()
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'coords', data: false })
      if (fetchResult) {
         form.setFieldValue('actioncoords', fetchResult);
      }
   };

   const handleSpawnCoords = async () => {
      close()
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'spawn_coords', data: false })
      if (fetchResult) {
         form.setFieldValue('spawnpos', fetchResult);
      }
   };


   return (
      <Paper p="xs" style={{ backgroundColor: '#2e3036', margin: '5px 0' }}>
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
               <TextInput
                  label={lang.GarageName}
                  description={lang.GarageCreateSpan}
                  placeholder={lang.GarageName}
                  {...form.getInputProps('name')}
               />

               <Select
                  label={lang.GarageType}
                  placeholder={lang.GarageType}
                  description={lang.GarageTypeSpan}
                  data={[
                     { value: 'garage', label: lang.GarageType1 },
                     { value: 'impound', label: lang.GarageType2 },
                     { value: 'custom', label: lang.GarageType3 },

                  ]}
                  {...form.getInputProps('garagetype')}
               />
               {form.values.garagetype === 'garage' && (
                  <>
                     <TextInput
                        label={lang.GarageDefaultImpound}
                        description={lang.GarageDefaultImpoundSpan}
                        disabled
                        placeholder={lang.GarageDefaultImpoundSpan}
                        {...form.getInputProps('defaultImpound')}
                     />

                  </>
               )}

               <Select
                  label={lang.GarageActionType}
                  placeholder={lang.GarageActionType}
                  description={lang.GarageActionTypeSpan}
                  data={[
                     { value: 'target', label: lang.GarageActionType1 },
                     { value: 'textui', label: lang.GarageActionType2 },
                     { value: 'radial', label: lang.GarageActionType3 },

                  ]}
                  {...form.getInputProps('zoneType')}
               />

               {form.values.zoneType === 'target' && (
                  <TextInput
                     label={lang.GarageNPC}
                     placeholder={lang.GarageNPC}
                     description={lang.GarageNPCSpan}
                     defaultValue={form.values.npchash}
                     {...form.getInputProps('npchash')}
                  />
               )}
               {form.values.garagetype !== 'custom' && (
                  <MultiSelect
                     label={lang.GarageVehicleType}
                     description={lang.GarageVehicleTypeSpan}
                     placeholder={lang.GarageVehicleType}
                     dropdownPosition="bottom"
                     data={[
                        { value: 'automobile', label: 'Automobile' },
                        { value: 'bicycle', label: 'Bicycle' },
                        { value: 'bike', label: 'Bike' },
                        { value: 'blimp', label: 'Blimp' },
                        { value: 'boat', label: 'Boat' },
                        { value: 'heli', label: 'Heli' },
                        { value: 'plane', label: 'Plane' },
                        { value: 'quadbike', label: 'Quadbike' },
                        { value: 'submarine', label: 'Submarine' },
                        { value: 'submarinecar', label: 'Submarinecar' },
                        { value: 'trailer', label: 'Trailer' },
                        { value: 'train', label: 'Train' },
                        { value: 'amphibious_quadbike', label: 'Amphibious Quadbike' },
                        { value: 'amphibious_automobile', label: 'Amphibious Automobile' },
                     ]}
                     {...form.getInputProps('carType')}
                  />

               )}
               <TextInput
                  label={lang.GarageJob}
                  placeholder={lang.GarageJob}
                  description={lang.GarageJobSpan}
                  {...form.getInputProps('job')}
               />


               {form.values.garagetype === 'impound' && (
                  <>
                     <NumberInput
                        defaultValue={form.values.priceImpound}
                        label={lang.GarageImpound}
                        description={lang.GarageImpoundSpan}
                        {...form.getInputProps('priceImpound')}
                     />
                     <TextInput
                        label={lang.GarageSociety}
                        placeholder={lang.GarageSociety}
                        description={lang.GarageSocietySpan}
                        {...form.getInputProps('society')}
                     />
                  </>
               )}

               <SimpleGrid cols={2}>
                  <Checkbox
                     label={lang.GarageDebug}
                     description={lang.GarageSocietySpan}
                     {...form.getInputProps('debug')}
                  />
                  {form.values.garagetype === 'garage' && (
                     <Checkbox
                        label={lang.GarageSharedVehicles}
                        description={lang.GarageSharedVehiclesSpan}
                        {...form.getInputProps('isShared')}
                     />
                  )}
                  <Checkbox
                     label={lang.GarageInTocar}
                     description={lang.GarageInTocarSpan}
                     {...form.getInputProps('intocar')}
                  />
                  <Checkbox
                     label={lang.GarageBlip}
                     description={lang.GarageBlipSpan}
                     checked={form.values.blip}
                     {...form.getInputProps('blip')}
                  />
               </SimpleGrid>
               {form.values.blip && (
                  <Group grow>
                     <NumberInput
                        defaultValue={form.values.blipsprite}
                        label={'Blip Sprite'}
                        {...form.getInputProps('blipsprite')}
                     />
                     <NumberInput
                        defaultValue={1}
                        label={'Blip Color'}
                        {...form.getInputProps('blipcolor')}
                     />
                  </Group>
               )}
               {form.values.garagetype === 'custom' && (
                  <Paper p={10}>
                     <TextInput
                        label={lang.GarageMenu13}
                        description={lang.GarageMenu14}
                        value={newVehicle.model}
                        maxLength={4}
                        {...form.getInputProps('platePrefix')}
                     />
                     <Space h="md" />
                     <SimpleGrid cols={2}  >
                        <Stack justify="space-around">
                           <TextInput
                              label={lang.GarageMenu15}
                              value={newVehicle.model}
                              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                           />
                           {form.values.job !== '' && (
                              <MultiSelect
                                 data={Grades}
                                 label={lang.GarageMenu17}
                                 maxDropdownHeight={200}
                                 value={newVehicle.grades}
                                 onChange={(value) => setNewVehicle({ ...newVehicle, grades: value })}
                              />
                           )}
                           <Button variant="light" size='xs' leftIcon={<IconPlus size="1rem" />} onClick={handleAddVehicle}>Add Vehicle</Button>
                        </Stack>
                        <ScrollArea.Autosize mah={260} placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                           <Stack spacing={5}>
                              {form.values.defaultCars.map((vehicle: any, index: number) => (
                                 <Paper key={`vehicle-${index}`} p={4} style={{ backgroundColor: '#2e3036' }}>
                                    <Header style={{ display: 'flex', justifyContent: 'space-between' }} height={"auto"} p={5}>
                                       {vehicle.model}
                                       <ActionIcon variant="default">
                                          <IconTrash size="1rem" color={'red'} onClick={() => handleDeleteVehicle(index)} />
                                       </ActionIcon>
                                    </Header>
                                    <Group spacing="xs">
                                       {vehicle.grades && <div style={{ padding: 4 }}>Grades  <Badge>  {vehicle.grades.join(', ')}  </Badge></div>}
                                    </Group>

                                 </Paper>
                              ))}
                           </Stack>
                        </ScrollArea.Autosize>


                     </SimpleGrid>
                  </Paper>
               )}



               <Button.Group>
                  <Button fullWidth onClick={() => handleCoordsGarage()} variant="light" size='xs' leftIcon={<IconMapPin size="1rem" />}>
                     {lang.GarageButton1}
                  </Button>
                  <Button fullWidth onClick={() => handleZoneGarage()} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                     {lang.GarageButton2}
                  </Button>
                  <Button fullWidth onClick={() => handleSpawnCoords()} variant="light" size='xs' leftIcon={<IconCarCrash size="1rem" />}>
                     {lang.GarageButton3}
                  </Button>
               </Button.Group>

               <Button type="submit" variant="light" size='xs' color="teal" leftIcon={<IconDatabase size="1rem" />}>{lang.GarageButton4}</Button>
            </Stack>

         </form>
      </Paper>
   )

};
export default Create;
