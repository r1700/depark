import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminUser, AdminUserFilters, CreateAdminUserRequest, UpdateAdminUserRequest } from '../../../Pages/adminUser/adminUserTypes';
import { fetchAdminUsersAPI, addAdminUserAPI, updateAdminUserAPI } from './adminUsersAPI';

export interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAdminUsers = createAsyncThunk<AdminUser[], AdminUserFilters | undefined, { rejectValue: string }>(
  'adminUsers/fetchAdminUsers',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await fetchAdminUsersAPI(filters);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? err.message ?? 'Failed to fetch admin users');
    }
  }
);

export const addAdminUser = createAsyncThunk<AdminUser, CreateAdminUserRequest, { rejectValue: string }>(
  'adminUsers/addAdminUser',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await addAdminUserAPI(payload);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? err.message ?? 'Failed to add admin user');
    }
  }
);

export const updateAdminUser = createAsyncThunk<AdminUser, UpdateAdminUserRequest, { rejectValue: string }>(
  'adminUsers/updateAdminUser',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await updateAdminUserAPI(payload);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? err.message ?? 'Failed to update admin user');
    }
  }
);
function sanitizeAdminUser(u: any): AdminUser {
  return {
    id: u.id,
    role: u.role ?? 'hr',
    permissions: Array.isArray(u.permissions) ? [...u.permissions] : [],
    lastLoginAt: u.lastLoginAt ?? null,
    baseUser: {
      email: u.baseUser?.email ?? '',
      firstName: u.baseUser?.firstName ?? '',
      lastName: u.baseUser?.lastName ?? '',
      createdAt: u.baseUser?.createdAt ?? null,
      updatedAt: u.baseUser?.updatedAt ?? null,
    },
  } as AdminUser;
}

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = Array.isArray(action.payload) ? action.payload.map(sanitizeAdminUser) : [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Failed to fetch admin users';
      })

      // ADD
      .addCase(addAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users.push(sanitizeAdminUser(action.payload));
      })
      .addCase(addAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Failed to add admin user';
      })

      // UPDATE
      .addCase(updateAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload && action.payload.id) {
          const updated = sanitizeAdminUser(action.payload);
          state.users = state.users.map(u => u.id === updated.id ? updated : u);
        }
      })
      .addCase(updateAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? 'Failed to update admin user';
      });
  },
});

export default adminUsersSlice.reducer;