import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/User";


export const addUser = createAsyncThunk(
  'users/addUser',
  async (newUser: Partial<User>, thunkAPI) => {
    try {      
      const response = await axios.post('/api/users/add', newUser);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user: Partial<User>, thunkAPI) => {
    try {      
      const response = await axios.put('/api/users/update', user);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, thunkAPI) => {
//     try {
// //       const mockUsers = [
// //         {
// //           id: '1',
// //           firstName: 'John',
// //           lastName: 'Doe',
// //           email: 'john.doe@example.com',
// //           employeeId: '123',
// //           status: 'approved',
// //           maxCarsAllowedParking: 2,
// //           createdBy: 'admin',
// //           createdAt: new Date().toISOString(),

// //         },
// //         {
// //           id: '2',
// //           firstName: 'Jane',
// //           lastName: 'Smith',
// //           email: 'jane.smith@example.com',
// //           employeeId: '124',
// //           status: 'pending',
// //           maxCarsAllowedParking: 1,
// //           createdBy: 'admin',
// //           createdAt: new Date().toISOString(),
// //         },
// //       ];
            
// // return mockUsers;
 
//        const response = await axios.get<User[]>('/api/users');
//        return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<User[]>('/api/users');
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

