import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from './GoogleAuthSlice';

const BASE_URL = process.env.REACT_APP_API_URL;

export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/OAuth/verify-google-token`, { idToken });
      const data = res.data;

      if (data.success) {
        return { user: data.user as User, token: data.idToken };
      } else {
        return rejectWithValue(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Authentication failed'
      );
    }
  }
);
