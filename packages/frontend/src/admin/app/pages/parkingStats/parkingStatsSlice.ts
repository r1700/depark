// src/admin/app/pages/adminDashBoard/parkingStatsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ParkingStatItem {
  day: string;
  hour: string;
  period: string;
  monthYear: string;
  entries: number;
  exits: number;
}

const initialState = {
  data: [] as ParkingStatItem[],
  loading: false,
  error: null as string | null,
  // drilldown:
  selectedDay: null as string | null,
  dayData: null as ParkingStatItem[] | null,
  dayLoading: false,
  dayError: null as string | null,
};

export type ParkingStatsState = typeof initialState;

// fetch main stats (useDay boolean sent as query param 'day')
export const fetchParkingStats = createAsyncThunk(
  'parkingStats/fetch',
  async (useDay: boolean, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_BASE}/parking-stats/stats`);
      url.searchParams.set('day', String(useDay));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
      const json = await res.json();
      return json as any[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Unknown error');
    }
  }
);

// fetch details for a specific day (date param)
export const fetchParkingDayDetails = createAsyncThunk(
  'parkingStats/fetchDay',
  async (periodValue: string, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_BASE}/parking-stats/stats`);
      url.searchParams.set('date', periodValue);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
      const json = await res.json();
      return { period: periodValue, items: json as any[] };
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Unknown error');
    }
  }
);

const slice = createSlice({
  name: 'parkingStats',
  initialState,
  reducers: {
    clearDay(state) {
      state.selectedDay = null;
      state.dayData = null;
      state.dayError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchParkingStats.fulfilled, (state, action) => {
        // מיפוי בסיסי - מומלץ לבצע את ה-format בקומפוננטה או פה לפי העדפה
        const mapped = action.payload.map((item: any) => {
          const date = new Date(item.period); // או parseISO אם צריך
          return {
            day: String(date.getDate()),
            hour: `${String(date.getHours()).padStart(2, '0')}:00`,
            period: item.period,
            monthYear: date.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
            entries: Number(item.entries) || 0,
            exits: Number(item.exits) || 0,
          } as ParkingStatItem;
        });
        state.data = mapped;
        state.loading = false;
      })
      .addCase(fetchParkingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed';
      })

      .addCase(fetchParkingDayDetails.pending, (state) => { state.dayLoading = true; state.dayError = null; })
      .addCase(fetchParkingDayDetails.fulfilled, (state, action) => {
        const { period, items } = action.payload as { period: string; items: any[] };
        const mapped = items.map((item: any) => {
          const date = new Date(item.period);
          return {
            day: String(date.getDate()),
            hour: `${String(date.getHours()).padStart(2, '0')}:00`,
            period: item.period,
            monthYear: date.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
            entries: Number(item.entries) || 0,
            exits: Number(item.exits) || 0,
          } as ParkingStatItem;
        });
        state.selectedDay = period;
        state.dayData = mapped;
        state.dayLoading = false;
      })
      .addCase(fetchParkingDayDetails.rejected, (state, action) => {
        state.dayLoading = false;
        state.dayError = action.payload as string || 'Failed';
      });
  }
});

export const { clearDay } = slice.actions;
export const clearParkingDayDetails = clearDay;
export default slice.reducer;