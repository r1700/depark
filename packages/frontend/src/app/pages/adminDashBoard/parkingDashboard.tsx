import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParkingData, setTabs} from './parkingSlice';
import DataTable from '../../components/table/table';

import type { AppDispatch } from '../../store'; 
const ParkingDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, status, tabs } = useSelector((state: any) => state.parking);
  useEffect(() => {
    dispatch(fetchParkingData(tabs));
  }, [dispatch, tabs]);

  const key = tabs.queryType.charAt(0).toUpperCase() + tabs.queryType.slice(1) + 'Query';
  const items = data ? data[key] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">parking-dashboard</h1>
      <div className="flex gap-2 mb-4">
        {['baseDay', 'baseMonth', 'baseHour', 'user', 'fullHour', 'fullDay'].map((type) => (
          <button
            key={type}
            className={`border p-2 rounded ${tabs.queryType === type ? 'bg-blue-200' : ''}`}
            onClick={() => dispatch(setTabs({ queryType: type as any }))}
          >
            {type}
          </button>
        ))}
      </div>
      {status === 'loading' && <p>Loading data...</p>}
      {status === 'succeeded' && <DataTable data={items} />}
      {status === 'failed' && <p>Error loading data</p>}
    </div>
  );
};

export default ParkingDashboard;
