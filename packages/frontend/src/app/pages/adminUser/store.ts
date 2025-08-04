// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import adminUsersReducer from './adminUserSlice';

const store = configureStore({
  reducer: {
    adminUsers: adminUsersReducer,
  },
});

// הוספת טיפוס ל-Dispatch
export type AppDispatch = typeof store.dispatch;  // טיפוס של dispatch
export type RootState = ReturnType<typeof store.getState>; // טיפוס של ה-state
export default store;
