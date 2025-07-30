import GenericForm from '../../../../components/forms/Form';
import { FieldConfig } from '../../../../components/forms/Form';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addVehicle, fetchVehicles, updateVehicle } from '../vehicleThunks';
import { Vehicle } from '../../../types/Vehicle';
import { mockUsers } from '../../../types/User';
import UserForm from '../../user/UserForm/UserForm';


const AddOrEditVehicleForm = ({ onClose, vehicleToEdit=null }
  : {
    onClose: () => void;
    vehicleToEdit?: Partial<Vehicle> | null;
  }) => {

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users) || mockUsers
  const newUsers: string[] = mockUsers.map((user) => `${user.firstName} ${user.lastName}`) || [];


  const VehicleFields: FieldConfig<Vehicle>[] = [
    { name: 'licensePlate', label: 'License Plate', required: true, type: 'text' },
    { name: 'user', label: 'User', required: true, type: 'select', options: newUsers },
    { name: 'width', label: 'Width', type: 'number' },
    { name: 'height', label: 'Height', type: 'number' },
    { name: 'length', label: 'Length', type: 'number' },
    { name: 'weight', label: 'Weight', type: 'number' },
    {name: 'dimensionsSource', label: 'dimensionsSource', type: 'select', 
     options: ['model_reference' ,'manual_override', 'government_db'],required: true},
    ]
  return (
    <GenericForm<Vehicle>
      title={vehicleToEdit ? 'Edit Vehicle' : 'Add Vehicle'}
      fields={VehicleFields}
      initialState={{ 'user': undefined, 'licensePlate': '','dimensionsSource':'manual_override'}}
      onSubmit={(data) => vehicleToEdit ? dispatch(updateVehicle(data)) : dispatch(addVehicle(data))}
      onClose={onClose}
      entityToEdit={vehicleToEdit}
    />
  );
  
}

export default AddOrEditVehicleForm;
