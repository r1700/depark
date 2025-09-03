import { useAppDispatch} from '../../../store';
import { FieldConfig, GenericForm } from '../../../../components/forms/Form';
import { addVehicle, updateVehicle } from '../vehicleThunks';

interface VehicleFormData {
  licensePlate: string;
  user: string;
  vehicleModelId: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  dimensionsSource: string;
}

const AddOrEditVehicleForm = ({ onClose, vehicleToEdit = null }
  : {
    onClose: () => void;
    vehicleToEdit?: any | null;
  }) => {

  const dispatch = useAppDispatch();
  const users: any[] =  []

  const VehicleFields: FieldConfig[] = [
    { name: 'licensePlate', label: 'License Plate', required: true, type: 'text' },
    {
      name: 'user', label: 'User', required: true, type: 'select', options: users.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
      }))
    },
    { name: 'vehicleModelId', label: 'Vehicle Model', required: true, type: 'number' },
    { name: 'width', label: 'Width', type: 'number', disabled: (data) => data.dimensionsSource === 'government_db' },
    { name: 'height', label: 'Height', type: 'number', disabled: (data) => data.dimensionsSource === 'government_db' },
    { name: 'length', label: 'Length', type: 'number', disabled: (data) => data.dimensionsSource === 'government_db' },
    { name: 'weight', label: 'Weight', type: 'number', disabled: (data) => data.dimensionsSource === 'government_db' },
    { name: 'dimensionsSource', label: 'dimensionsSource', type: 'select',options: 
      [{ label: 'model_reference', value: 'model_reference' },
      { label: 'manual_override', value: 'manual_override' },
      { label: 'government_db', value: 'government_db' }], required: true
    },
  ]
  return (  
    <GenericForm
      title={vehicleToEdit ? 'Edit Vehicle' : 'Add Vehicle'}
      fields={VehicleFields}
      initialState={{ user: undefined, licensePlate: '', dimensionsSource: 'manual_override' }}
      onSubmit={(data:any) => vehicleToEdit ? dispatch(updateVehicle(data)) : dispatch(addVehicle(data))}
      onClose={onClose}
      entityToEdit={vehicleToEdit}/>
  );
}

export default AddOrEditVehicleForm;



