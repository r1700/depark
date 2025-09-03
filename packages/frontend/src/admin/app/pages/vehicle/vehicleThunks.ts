import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Vehicle } from '../../../../../../backend/src/model/vehicle/vehicle'; 

export const addVehicle = createAsyncThunk(
  'vehicles/addVehicle',
  async (newVehicle: Partial<Vehicle>, thunkAPI) => {
    try {      
      const response = await axios.post('api/vehicles/add', newVehicle);
      return response.data;
    } catch (error: any) {
      console.log('Error adding vehicle:', error.response.data);      
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async (vehicle: Partial<Vehicle>, thunkAPI) => {
    try {      
      const response = await axios.put('/api/vehicles/update', vehicle);
      console.log('Vehicle updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

