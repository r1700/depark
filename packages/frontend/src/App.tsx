import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ParkingDashboard from './app/pages/adminDashBoard/parkingDashboard';
import Chart from './app/pages/adminDashBoard/Chart';

export default function App() {
  return (
    <Provider store={store}>
      {/* <ParkingDashboard /> */}
      <Chart/>
    </Provider>
  );
}