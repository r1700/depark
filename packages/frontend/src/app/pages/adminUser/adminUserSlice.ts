// src/redux/adminUsersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// הגדרת סוגי הנתונים
interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// פעולה אסינכרונית לקרוא את המשתמשים
export const fetchAdminUsers = createAsyncThunk<AdminUser[], Record<string, any>>(
  'adminUsers/fetchAdminUsers',
  async (filters = {}) => {
    const response = await axios.get('/api/admin/users', { params: filters });
    return response.data;  // מחזירים את הנתונים שהתקבלו
  }
);

// יצירת ה-slice
const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [] as AdminUser[],  // טיפוס נכון עבור users
    loading: false,
    error: null as string | null  // טיפוס נכון עבור error
  } as AdminUsersState,  // טיפוס ראשוני מתאים עבור ה-state
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;  // עדכון מצב ה-loading
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;  // עדכון מצב ה-loading
        state.users = action.payload;  // הוספת המשתמשים שהתקבלו ל-state
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;  // עדכון מצב ה-loading
        state.error = action.error.message || null;  // שמירת השגיאה אם יש
      });
  }
});

export default adminUsersSlice.reducer;
