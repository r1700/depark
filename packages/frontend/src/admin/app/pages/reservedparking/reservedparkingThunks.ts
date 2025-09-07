// app/pages/reservedparking/reservedparkingThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ReservedParking } from "../../types/Reservedparking";

export const addReservedParking = createAsyncThunk(
  'reservedParking/addReservedParking',
  async (newReserved: Partial<ReservedParking>, thunkAPI) => {
    try {
      const response = await axios.post('/api/reservedparking/add', newReserved);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const updateReservedParking = createAsyncThunk(
  'reservedParking/updateReservedParking',
  async (reserved: Partial<ReservedParking>, thunkAPI) => {
    try {
      const response = await axios.put('/api/reservedparking/update', reserved);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

export const fetchReservedParking = createAsyncThunk(
  'reservedParking/fetchReservedParking',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<ReservedParking[]>('/api/reservedparking');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

// חדש: thunk למחיקה לפי id
export const deleteReservedParkingThunk = createAsyncThunk<
  number, // return type on fulfilled -> id שנמחק
  number, // argument -> id to delete
  { rejectValue: string }
>(
  'reservedParking/deleteReservedParking',
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/reservedparking/${id}`);
      // נניח שהשרת מחזיר status 200/204; נחזיר את ה-id כדי שהslice יסיר אותו מה-state
      if (response.status >= 200 && response.status < 300) {
        return id;
      }
      return thunkAPI.rejectWithValue('Delete request failed with status ' + response.status);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message ?? 'Network error');
    }
  }
);