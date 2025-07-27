import { createSlice, } from '@reduxjs/toolkit';
import { addVehicle,  updateVehicle } from './thunks';
import { Vehicle } from '../types/Vehicle';


interface VehicleState {
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
        state.error = null;
      })
    //   .addCase(updateVehicle.fulfilled, (state, action) => {
    //     state.loading = false;
    //     // מחליפים את המשתמש המעודכן ברשימה ע"י מציאת המזהה שלו
    //     const index = state.users.findIndex((u) => u.id === action.payload.id);
    //     if (index !== -1) {
    //       state.users[index] = action.payload;
    //     }
    //   })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update failed';
      });
  },
});

export const { clearVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;
