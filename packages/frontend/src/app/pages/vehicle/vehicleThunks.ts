import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Vehicle } from "../../types/Vehicle";


export const addVehicle = createAsyncThunk(
  'vehicles/addVehicle',
  async (newVehicle: Partial<Vehicle>, thunkAPI) => {
    try {      
      const response = await axios.post('/api/vehicle/add', newVehicle);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async (vehicle: Partial<Vehicle>, thunkAPI) => {
    try {      
      const response = await axios.put('/api/vehicles/update', vehicle);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Vehicle[]>('/api/vehicles');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
