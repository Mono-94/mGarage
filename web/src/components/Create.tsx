import React, { useState } from "react";
import { SimpleGrid, TextInput, Checkbox, Button, Select, MultiSelect, Stack, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchNui } from "../utils/fetchNui";
import Lang from "../utils/LangR";
import { IconCarCrash, IconDatabase, IconMapPin } from "@tabler/icons-react";

const Create: React.FC = () => {
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
      const fetchResult = await fetchNui<any>('mGarage:adm', { action: 'coords', data: false })
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


   return (<>
      <>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               form.onSubmit(async (values) => {

                  if (form.isValid()) {
                     const success = await handleCreateGarage();
                     if (success) {
                        form.reset();
                     }
                  }
               })(e);
            }}
         >


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
                  <Checkbox
                     label={lang.GarageSharedVehicles}
                     description={lang.GarageSharedVehiclesSpan}
                     {...form.getInputProps('isShared')}
                  />
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
                  <SimpleGrid cols={2}>
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
                  </SimpleGrid>
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

      </>
   </>)

};
export default Create;
