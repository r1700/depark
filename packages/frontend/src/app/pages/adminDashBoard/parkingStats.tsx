import React, { useState, useEffect } from 'react';
import GenericStatsChart from './GenericStatsChart';  // הרכיב הגנרי שכתבנו
import { log } from 'console';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


const ParkingStatsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // למשל נבחר day=false (10 שעות אחורה) או day=true (10 ימים אחורה)
    const [useDay, setUseDay] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const url = useDay
            ? `${API_BASE}/parking-stats/stats?day=true`
            : `${API_BASE}/parking-stats/stats`;

        fetch(url)
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
    }, [useDay]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log('Parking Stats Data:', data); // Debugging line to check data structure

    return (
        <>
            <button onClick={() => setUseDay(!useDay)}>
                Show last 10 {useDay ? 'days' : 'hours'}
            </button>

            <GenericStatsChart
                data={data}
                xKey="period"
                barKeys={['entries', 'exits']}
                pieKeys={['entries', 'exits']}
                xLabel={useDay ? 'Day' : 'Hour'}
            />
        </>
    );
};

export default ParkingStatsPage;