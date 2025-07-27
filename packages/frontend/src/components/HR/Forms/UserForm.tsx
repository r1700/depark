import GenericForm from './Form';
import { FieldConfig } from './Form';
import { useAppDispatch } from '../store/hook';
import { addUser, updateUser } from '../store/thunks';
import { User } from '../types/User';

const userFields: FieldConfig<User>[] = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'maxCarsAllowedParking', label: 'Max Cars', type: 'number' },
];

const UserForm=({
  onClose,
  userToEdit,
}: {
  onClose: () => void;
  userToEdit?: Partial<User> | null;
}) => {
  const dispatch = useAppDispatch(); 

  return (
    <GenericForm<User>
          title={userToEdit ? 'Edit User' : 'Add User'}
          fields={userFields}
          initialState={{}}
          onSubmit={(data) => userToEdit?dispatch(updateUser(data)):dispatch(addUser(data))}
          onClose={onClose}
          entityToEdit={userToEdit} 
          />
  );
}  


export default UserForm;




