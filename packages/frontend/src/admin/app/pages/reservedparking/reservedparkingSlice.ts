import { createSlice } from '@reduxjs/toolkit';
import { addReservedParking, fetchReservedParking, updateReservedParking } from './reservedparkingThunks';
import { ReservedParking } from '../../types/Reservedparking';

export interface ReservedParkingState {
  reservedParking: ReservedParking[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservedParkingState = {
  reservedParking: [],
  loading: false,
  error: null,
};

const reservedParkingSlice = createSlice({
  name: 'reservedParking',
  initialState,
  reducers: {
    clearReservedParking: (state) => {
      state.reservedParking = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservedParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservedParking.fulfilled, (state, action) => {
        state.loading = false;
        state.reservedParking = action.payload;
        state.error = null;
      })
      .addCase(fetchReservedParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error in fetching reserved parking';
      })
      .addCase(addReservedParking.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReservedParking.fulfilled, (state, action) => {
        state.loading = false;
        state.reservedParking.push(action.payload);
      })
      .addCase(addReservedParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateReservedParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservedParking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservedParking.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reservedParking[index] = action.payload;
        }
      })
      .addCase(updateReservedParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update failed';
      });
  },
});

export const { clearReservedParking } = reservedParkingSlice.actions;
export default reservedParkingSlice.reducer;
