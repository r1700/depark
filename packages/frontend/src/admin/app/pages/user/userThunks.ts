// app/pages/user/userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/User";

// ✅ הוספת משתמש
export const addUser = createAsyncThunk(
  "users/addUser",
  async (newUser: Partial<User>, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/add", newUser);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

// ✅ עדכון משתמש
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user: Partial<User>, thunkAPI) => {
    try {
      const response = await axios.put("/api/users/update", user);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);
// export const uploadCsvFile = createAsyncThunk( 
//   'api/importFromCSV/import-csv',
//   async (file: File, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       const response = await axios.post('api/importFromCSV/import-csv', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
export const uploadCsvFile = createAsyncThunk(
  'api/importFromCSV/import-csv',
  async (file: File, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/importFromCSV/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // ✅ וודא שאתה מחזיר רק מידע סיריאלי
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);

    }
  }
);

// ✅ שליפת משתמשים
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<User[]>("/api/users");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

// ✅ מחיקת משתמש לפי id
export const deleteUserThunk = createAsyncThunk<
  number, // הערך המוחזר ב־fulfilled -> ה־id שנמחק
  number, // הארגומנט שנשלח ל־thunk -> id למחיקה
  { rejectValue: string }
>(
  "users/deleteUser",
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/users/${id}`);
      if (response.status >= 200 && response.status < 300) {
        return id;
      }
      return thunkAPI.rejectWithValue(
        "Delete request failed with status " + response.status
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data ?? error.message ?? "Network error"
      );
    }
  }
);
