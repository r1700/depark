import React, { use, useEffect, useState } from 'react';
import { Container, Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hook';
import { RootState } from '../store/store'
import { fetchUsers } from '../store/thunks';
//import AddUser from '../AddUser/AddUser';
import { User } from '../types/User';
import AddOrEditUserForm from '../Forms/UserForm';
//import { GenericForm } from '../AddUser/AddUser';
import UserForm from '../Forms/UserForm';
import VehicleForm from '../Forms/VehicleForm';
import { Vehicle } from '../types/Vehicle';

const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 2,
  p: 4,
  width: { xs: '90%', sm: 400 },
  align: 'center',
};

export const mockUsers: Partial<User>[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    employeeId: '123',
    status: 'approved',
    maxCarsAllowedParking: 2,
    createdBy: 'admin',
    createdAt: new Date(),

  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    employeeId: '124',
    status: 'pending',
    maxCarsAllowedParking: 1,
    createdBy: 'admin',
    createdAt: new Date(),
  },
];

export default function UserList() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Partial<Vehicle> | null>(null);

  interface AddOrEditProps {
    userToEdit?: Partial<User> | null;
    vehicleToEdit?: Partial<User> | null;
  }

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const openAddVehicleModal = () => {
    setShowAddVehicleModal(true);
  };
  const closeAddVehicleModal = () => {
    setShowAddVehicleModal(false);
  };


  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function handleEditUser(employeeId: string) {
    const userToEdit = users.find(u => u.employeeId === employeeId) || mockUsers.find(u => u?.employeeId === employeeId);
    if (userToEdit) {
      console.log('Editing user:', userToEdit);
      setSelectedUser(
       userToEdit as Partial<User>
      );
      openAddUserModal();
    }
  }

  function handleAddVehicle(employeeId: string) {
    setSelectedVehicle(null);
    openAddVehicleModal();

  }

  function handleDelete(employeeId: string) {
    console.log('Delete user with id:', employeeId);
  }

  if (loading) return <p>loading...</p>;
  //if (error) return <p>error: {error}</p>;



  return (<>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>First Name</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Last Name</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {mockUsers.map((user, index: number) => (

          <tr key={user ? user.id : index}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.firstName}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.lastName}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <button
                onClick={() => handleEditUser(user.employeeId ? user.employeeId : '')}
                style={{ marginRight: '8px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleAddVehicle(user.employeeId ? user.employeeId : '')}
                style={{ marginRight: '8px' }}
              >
                Add Vehicle
              </button>

              <button
                onClick={() => handleDelete(user.employeeId ? user.employeeId : '')}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <Fade in={showAddUserModal || showAddVehicleModal} >
      <Box sx={styleModal}>

{showAddUserModal? <UserForm onClose={closeAddUserModal} userToEdit={selectedUser}
         ></UserForm>:<VehicleForm onClose={closeAddVehicleModal} vehicleToEdit={selectedVehicle}
         ></VehicleForm>}
        
         
      </Box>
    </Fade>
  </>
  );
}

