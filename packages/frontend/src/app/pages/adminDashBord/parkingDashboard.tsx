import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParkingData, setFilters } from './parkingSlice';
import DataTable from '../../../components/table/table';

import type { AppDispatch } from '../../store'; 
const ParkingDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, status, filters } = useSelector((state: any) => state.parking);
  useEffect(() => {
    dispatch(fetchParkingData(filters));
  }, [dispatch, filters]);

  const key = filters.queryType.charAt(0).toUpperCase() + filters.queryType.slice(1) + 'Query';
  const items = data ? data[key] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">parking-dashbord</h1>
      <div className="flex gap-2 mb-4">
        {['baseDay', 'baseMonth', 'baseHour', 'user', 'fullHour', 'fullDay'].map((type) => (
          <button
            key={type}
            className={`border p-2 rounded ${filters.queryType === type ? 'bg-blue-200' : ''}`}
            onClick={() => dispatch(setFilters({ queryType: type as any }))}
          >
            {type}
          </button>
        ))}
      </div>
      {status === 'loading' && <p>טוען נתונים...</p>}
      {status === 'succeeded' && <DataTable data={items} />}
      {status === 'failed' && <p>שגיאה בטעינת נתונים</p>}
    </div>
  );
};

export default ParkingDashboard;
