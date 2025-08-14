import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminUser } from './adminUserTypes';
import { fetchAdminUsersAPI } from './adminUsersAPI';

interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAdminUsers = createAsyncThunk(
  'adminUsers/fetchAdminUsers',
  async () => {
    return await fetchAdminUsersAPI();
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch admin users';
      });
  },
});

export default adminUsersSlice.reducer;