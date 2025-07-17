import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchParkingData = createAsyncThunk(
//   'parking/fetchData',
//   async (filters: { queryType: string }) => {
//     const response = await axios.get(`/api/parking/${filters.queryType}`);
//     return response.data;
//   }
// ); זה הטוב ובהמשך זה לדוגמא
import {
  getBaseDayQuery,
  getBaseMonthQuery,
  getBaseHourQuery,
  getUserQuery,
  getFullHourQuery,
  getFullDayQuery
}  from '../app/exampleQueryResponse';
 export interface Filters {
  queryType: 'baseDay' | 'baseMonth' | 'baseHour' | 'user' | 'fullHour' | 'fullDay';
}

 export interface ParkingState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filters: Filters;
}

// ✅ asyncThunk קודם
export const fetchParkingData = createAsyncThunk(
  'parking/fetchData',

  async (filters: Filters) => {
    const queryMap: Record<Filters['queryType'], () => object> = {
      baseDay: getBaseDayQuery,
      baseMonth: getBaseMonthQuery,
      baseHour: getBaseHourQuery,
      user: getUserQuery,
      fullHour: getFullHourQuery,
      fullDay: getFullDayQuery,
    };
    
    const data = queryMap[filters.queryType]();
    const key = filters.queryType.charAt(0).toUpperCase() + filters.queryType.slice(1) + 'Query';
    console.log('data:', data);
    return { [key]: data };
  }
);
// ✅ initialState אחריו
const initialState: ParkingState = {
  data: null,
  status: 'idle',
  filters: { queryType: 'baseDay' }
};

// ✅ slice אחרי הכל
const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.data = null;
      state.status = 'idle';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchParkingData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParkingData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchParkingData.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const {resetFilters , setFilters } = parkingSlice.actions;
export default parkingSlice.reducer;
