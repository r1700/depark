import { FieldConfig, GenericForm } from '../../../../components/forms/Form';
import { useAppDispatch } from '../../../store';
import { addUser, updateUser } from '../userThunks';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  maxCarsAllowedParking: number;
}

const userFields: FieldConfig<UserFormData>[] = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'maxCarsAllowedParking', label: 'Max Cars', type: 'number' },
];

const UserForm = ({
  onClose,
  userToEdit = null,
}: {
  onClose: () => void;
  userToEdit?: any | null;
}) => {
  const dispatch = useAppDispatch();

  return (
    <GenericForm
      title={userToEdit ? 'Edit User' : 'Add User'}
      fields={userFields}
      initialState={{}}
      onSubmit={(data: any) => userToEdit ? dispatch(updateUser(data)) : dispatch(addUser(data))}
      onClose={onClose}
      entityToEdit={userToEdit}
    />
  );
}

export default UserForm;




