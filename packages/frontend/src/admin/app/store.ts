import { configureStore } from '@reduxjs/toolkit';
import adminUsersReducer from './pages/adminUser/adminUserSlice';
import parkingReducer from './pages/adminDashBoard/parkingSlice';
import vehicleReducer from './pages/vehicle/vehicleSlice';
import userReducer from './pages/user/usersSlice';
import parkingStatsReducer from './pages/parkingStats/parkingStatsSlice';
import surfaceStatsReducer from './pages/surfaceStats/surfaceStatsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import parkingStatusReducer from '../components/adminDashboard/parkingStatusSlice';

export const store = configureStore({
  reducer: {
    adminUsers: adminUsersReducer,
    parking: parkingReducer,
    vehicles: vehicleReducer,
    users: userReducer,
    parkingStats: parkingStatsReducer,
    surfaceStats: surfaceStatsReducer,
    parkingStatus: parkingStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
