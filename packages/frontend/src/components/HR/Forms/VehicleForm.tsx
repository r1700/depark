import GenericForm from './Form';
import { FieldConfig } from './Form';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {  addVehicle, fetchUsers, updateVehicle } from '../store/thunks';
import { Vehicle } from '../types/Vehicle';
import { mockUsers } from '../Users/UserList';


const AddOrEditVehicleForm=({onClose,vehicleToEdit}
  : {
    onClose: () => void;
    vehicleToEdit?: Partial<Vehicle> | null;
  }) => {

const dispatch = useAppDispatch();
const users= useAppSelector((state) => state.users.users) || mockUsers
const newUsers: string[] = mockUsers.map((user) => `${user.firstName} ${user.lastName}`) || [];


  const VehicleFields: FieldConfig<Vehicle>[] = [
  { name: 'licensePlate', label: 'License Plate', required: true,type:'text'},
  { name:'user',label:'User',required:true,type:'select',options: newUsers// לדוגמה, לבחור לפי שם
}
];

  return (
    <GenericForm<Vehicle>
          title={vehicleToEdit ? 'Edit Vehicle' : 'Add Vehicle'}
          fields={VehicleFields}
          initialState={{}}
          onSubmit={(data) => vehicleToEdit?dispatch(updateVehicle(data)):dispatch(addVehicle(data))}
          onClose={onClose}
          entityToEdit={vehicleToEdit}
           />
  );
}   

export default AddOrEditVehicleForm;
