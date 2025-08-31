import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from '../../../../../../backend/src/model/user/user'; 


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

