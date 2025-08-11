import GenericForm from '../../../../components/forms/Form';
import { FieldConfig } from '../../../../components/forms/Form';
import { useAppDispatch } from '../../../store';
import { addUser, updateUser } from '../userThunks';
import { User } from '../../../types/User';

const userFields: FieldConfig<User>[] = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'maxCarsAllowedParking', label: 'Max Cars', type: 'number' },
];

const UserForm=({
  onClose,
  userToEdit=null,
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




