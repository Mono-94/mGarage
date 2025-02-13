import { MultiSelect } from '@mantine/core';
import { useLang } from "../../utils/LangContext";
import { UseFormReturnType } from '@mantine/form';

interface MultiSelectWrapperProps {
  onChange?: (values: string[]) => void; 
  garageType: string[];
  form?: UseFormReturnType<any>; 
  disable?: any;
}

const VehicleType: React.FC<MultiSelectWrapperProps> = ({ onChange, garageType, form, disable }) => {
  const lang = useLang();

  const handleChange = (values: string[]) => {
    if (onChange) {
      onChange(values);
    }
    if (form) {
      form.setFieldValue('carType', values);
    }
  };

  const inputProps = form ? form.getInputProps('carType') : {};

  return (
    <MultiSelect
      size="xs"
      disabled={disable}
      label={lang.GarageVehicleType}
      placeholder={lang.GarageVehicleTypeSpan}
      description={lang.GarageVehicleTypeSpan}
      defaultValue={garageType}
      dropdownPosition="bottom"
      withinPortal={true}
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
      onChange={handleChange} 
      {...inputProps} 
    />
  );
};

export default VehicleType;
