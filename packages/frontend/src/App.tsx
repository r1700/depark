import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ParkingDashboard from './parking/parkingDashboard';

export default function App() {
  return (
    <Provider store={store}>
      <ParkingDashboard />
    </Provider>
  );
}