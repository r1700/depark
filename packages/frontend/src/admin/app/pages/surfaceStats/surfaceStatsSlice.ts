import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface SurfaceStatItem {
  spot_number: string;
  entries: number;
  exits: number;
}

const initialState = {
  data: [] as SurfaceStatItem[],
  loading: false,
  error: null as string | null,
};

export type SurfaceStatsState = typeof initialState;

export const fetchSurfaceStats = createAsyncThunk(
  'surfaceStats/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_BASE}/surface-stats/stats`);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
      const json = await res.json();
      return json as any[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Unknown error');
    }
  }
);

const slice = createSlice({
  name: 'surfaceStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurfaceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurfaceStats.fulfilled, (state, action) => {
        // מניח שה-API מחזיר objects עם spot_number, entries, exits
        const mapped = Array.isArray(action.payload)
          ? action.payload.map((it: any) => ({
              spot_number: String(it.spot_number ?? it.spotNumber ?? ''),
              entries: Number(it.entries) || 0,
              exits: Number(it.exits) || 0,
            }))
          : [];
        state.data = mapped;
        state.loading = false;
      })
      .addCase(fetchSurfaceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load';
      });
  },
});

export default slice.reducer;