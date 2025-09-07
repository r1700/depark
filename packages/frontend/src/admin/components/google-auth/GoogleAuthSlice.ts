import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authenticateUser } from './GoogleAuthThunks';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  loggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    loadFromStorage(state) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        state.token = token;
        state.user = JSON.parse(userStr);
        state.loggedIn = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authenticateUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.loggedIn = true;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
export type { User, AuthState };
