import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchParkingData = createAsyncThunk(
//   'parking/fetchData',
//   async (filters: { queryType: string }) => {
//     const response = await axios.get(`/api/parking/${filters.queryType}`);
//     return response.data;
//   }
// ); Option to connect to the server
import {
  getBaseDayQuery,
  getBaseMonthQuery,
  getBaseHourQuery,
  getUserQuery,
  getFullHourQuery,
  getFullDayQuery
} from '../../exampleQueryResponse';
export interface Tabs {
  queryType: 'baseDay' | 'baseMonth' | 'baseHour' | 'user' | 'fullHour' | 'fullDay';
}

export interface ParkingState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  tabs: Tabs;
}

// ✅ asyncThunk 
export const fetchParkingData = createAsyncThunk(
  'parking/fetchData',

  async (tabs: Tabs) => {
    const queryMap: Record<Tabs['queryType'], () => object> = {
      baseDay: getBaseDayQuery,
      baseMonth: getBaseMonthQuery,
      baseHour: getBaseHourQuery,
      user: getUserQuery,
      fullHour: getFullHourQuery,
      fullDay: getFullDayQuery,
    };

    const data = queryMap[tabs.queryType]();
    const key = tabs.queryType.charAt(0).toUpperCase() + tabs.queryType.slice(1) + 'Query';
    console.log('data:', data);
    return { [key]: data };
  }
);
// ✅ initialState
const initialState: ParkingState = {
  data: null,
  status: 'idle',
  tabs: { queryType: 'baseDay' }
};

// ✅ slice
const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setTabs(state, action) {
      state.tabs = action.payload;
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

export const { setTabs } = parkingSlice.actions;
export default parkingSlice.reducer;
