import React, { useState, useEffect } from 'react';
import GenericStatsChart from '../components/graph/GenericStatsChart';
import DataTable from '../components/table/table';
import { alignProperty } from '@mui/material/styles/cssUtils';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


interface SurfaceStatItem {
  spot_number: string;
  entries: number;
  exits: number;
}
const SurfaceStatsPage = () => {
  const [data, setData] = useState<SurfaceStatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/surface-stats/stats`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');        
        return res.json();
      })
      .then(json => {
        setData(json);
      })
      .catch(e => {
        setError(e.message || 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);  // אין תלות ב-useDay

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
console.log('Surface Stats Data:', data); // Debugging line to check data structure
const tableColumns = [
    { id: 'spot_number', label: 'Spot Number' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ];

  const tableRows = data.map(d=> ({   
    spot_number: d.spot_number,
    entries: d.entries,
    exits: d.exits,
  }));
  return (
    <>
      <GenericStatsChart
        data={data}
        xKey="spot_number"
        barKeys={['entries', 'exits']}
        pieKeys={['entries', 'exits']}
        tableColumns={tableColumns}
        tableRows={tableRows}
        xLabel="Entries & Exits per Spot"
        title="Above-Ground Parking Traffic"
      />
    </>
  );
};

export default SurfaceStatsPage;