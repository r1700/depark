import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
export interface ParkingStatusState {
  date: string | null;
  count: number | null;
  loading: boolean;
  error: string | null;
}
const initialState: ParkingStatusState = {
  date:new Date().toISOString(),
  count: null,
  loading: false,
  error: null,
};
export const fetchCount = createAsyncThunk<
  number,
  string | undefined,
  { rejectValue: string }
>('parkingStatus/fetchCount', async (date, thunkAPI) => {
  try {
    const response = await fetch('/api/parkingStatus/Parking-space-occupied', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(date ? { date } : {}),
    });
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData.error || 'Error fetching data');
      } catch {
        return thunkAPI.rejectWithValue('Error fetching data');
      }
    }
    const data = await response.json();
    const raw = data['occupied Underground Spots Count'];
    const count = typeof raw === 'number' ? raw : Number(raw);
    if (Number.isNaN(count)) {
      return thunkAPI.rejectWithValue('Invalid response from server');
    }
    return count;
  } catch (err) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue('Unknown error');
  }
});
const parkingStatusSlice = createSlice({
  name: 'parkingStatus', // To prevent conflictt
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload;
    },
    setCount(state, action: PayloadAction<number | null>) {
      state.count = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.count = action.payload;
        state.error = null;
      })
      .addCase(fetchCount.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Error fetching data';
      });
  },
});
export const { setDate, setCount, setError } = parkingStatusSlice.actions;
export default parkingStatusSlice.reducer;