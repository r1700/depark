import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from '../../types/User';

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
// export const uploadCsvFile = createAsyncThunk( 
//   'api/importFromCSV/import-csv',
//   async (file: File, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       const response = await axios.post('api/importFromCSV/import-csv', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
export const uploadCsvFile = createAsyncThunk(
  'api/importFromCSV/import-csv',
  async (file: File, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/importFromCSV/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // ✅ וודא שאתה מחזיר רק מידע סיריאלי
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      // console.log('Fetching users...');

      const response = await axios.get<User[]>('/api/users');
      // console.log(response.data);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

