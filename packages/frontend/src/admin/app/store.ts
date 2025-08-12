import { configureStore } from '@reduxjs/toolkit';
import parkingReducer from './pages/adminDashBoard/parkingSlice';
import vehicleReducer from './pages/vehicle/vehicleSlice';
import userReducer from './pages/user/usersSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';


export const store = configureStore({
  reducer: { parking: parkingReducer ,
    vehicles: vehicleReducer,
    users: userReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;