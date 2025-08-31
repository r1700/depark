import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser, AdminUserFilters, CreateAdminUserRequest,UpdateAdminUserRequest } from './adminUserTypes';
import { fetchAdminUsersAPI, addAdminUserAPI ,updateAdminUserAPI} from './adminUsersAPI';

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
  async (filters?: AdminUserFilters) => {
    return await fetchAdminUsersAPI(filters);
  }
);
export const addAdminUser = createAsyncThunk(
  'adminUsers/addAdminUser',
  async (payload: CreateAdminUserRequest, { rejectWithValue }) => {
    try {
      const user = await addAdminUserAPI(payload);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message ?? 'Failed to add admin user');
    }
  }
);

export const updateAdminUser = createAsyncThunk(
  'adminUsers/updateAdminUser',
  async (payload: UpdateAdminUserRequest, { rejectWithValue }) => {
    try {
      const user = await updateAdminUserAPI(payload);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message ?? 'Failed to update admin user');
    }
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {

        console.log('fetchAdminUsers.fulfilled payload:', action.payload);
        console.log('payload.isArray:', Array.isArray(action.payload));
        console.log('payload ownProps:', Object.getOwnPropertyNames(action.payload ?? {}));
        if (action.payload?.[0]) console.log('first item ownProps:', Object.getOwnPropertyNames(action.payload[0]));

        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch admin users';
      })
      .addCase(updateAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(updateAdminUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
      state.loading = false;
      const updated = action.payload;
      const idx = state.users.findIndex(u => u.id === updated.id);
      if (idx !== -1) {
        state.users[idx] = updated;
      } else {
        state.users.unshift(updated);
      }
    })
    .addCase(updateAdminUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string ?? action.error.message ?? 'Failed to update admin user';
    });
},
});

export default adminUsersSlice.reducer;