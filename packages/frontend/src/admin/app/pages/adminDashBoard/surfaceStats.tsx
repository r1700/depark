import React, { useState, useEffect } from 'react';
import GenericStatsChart from './GenericStatsChart';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const SurfaceStatsPage = () => {
  const [data, setData] = useState([]);
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

  return (
    <>
      <GenericStatsChart
        data={data}
        xKey="spotNumber"
        barKeys={['entries', 'exits']}
        pieKeys={['entries', 'exits']}
        xLabel="Parking Spot"
      />
    </>
  );
};

export default SurfaceStatsPage;