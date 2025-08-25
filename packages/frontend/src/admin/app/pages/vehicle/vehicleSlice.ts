import { createSlice, PayloadAction, } from '@reduxjs/toolkit';
import { addVehicle, updateVehicle } from './vehicleThunks';
import { Vehicle } from '../../types/Vehicle';



export interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

 const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
};


 const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearVehicles: (state) => {
      state.vehicles = [];
    },
  },
  extraReducers: (builder) => {
    builder  
      .addCase(addVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload); 
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.loading = false;
        const index = state.vehicles.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error updating vehicle';
      });
  },
});

export const { clearVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;
