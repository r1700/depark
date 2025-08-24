import React, { useState, useEffect } from 'react';
import GenericStatsChart from '../components/graph/GenericStatsChart';
import { format } from 'date-fns/format';
import { parseISO} from 'date-fns/parseISO';
import { Button } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ParkingStatItem {
  day: string;
  hour: string;
  period: string;
  monthYear: string;
  entries: number;
  exits: number;
}

const ParkingStatsPage: React.FC = () => {
  const [data, setData] = useState<ParkingStatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useDay, setUseDay] = useState<boolean>(true);

  // drilldown states
  const [selectedDayPeriod, setSelectedDayPeriod] = useState<string | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<ParkingStatItem[] | null>(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [errorDay, setErrorDay] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(`${API_BASE}/parking-stats/stats`);
        url.searchParams.set('day', String(useDay));
        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Invalid response format: expected array');

        const mapped: ParkingStatItem[] = json.map((item: any) => {
          const date = parseISO(item.period);
          return {
            day: format(date, 'd'),
            hour: format(date, 'HH:00'),
            period: item.period,
            monthYear: format(date, 'MMM yyyy'),
            entries: Number(item.entries) || 0,
            exits: Number(item.exits) || 0,
          };
        });

        setData(mapped);
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        setError(e.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [useDay]);

  const currentView = 'Last 10 days'; // fixed, no toggle

  // compute xLabel and xKey for the main chart
  let xLabel = '';
  let xKey = useDay ? 'day' : 'hour';

  if (useDay) {
    const monthEntries: Map<string, string> = new Map();
    data.forEach(d => {
      if (!monthEntries.has(d.monthYear)) monthEntries.set(d.monthYear, d.period);
    });
    const monthsSorted = Array.from(monthEntries.entries())
      .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime())
      .map(([monthYear]) => monthYear);
    xLabel = monthsSorted.length > 0 ? monthsSorted.join(' / ') : '';
  } else {
    const dayMap: Map<string, string> = new Map();
    data.forEach(d => {
      const datePart = d.period.split(' ')[0];
      if (!dayMap.has(datePart)) dayMap.set(datePart, d.period);
    });
    const daysSorted = Array.from(dayMap.entries())
      .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime())
      .map(([dateStr]) => format(parseISO(dateStr), 'dd MMM yyyy'));
    xLabel = daysSorted.length > 0 ? daysSorted.join(' / ') : '';
    xKey = 'hour';
  }

  // handler: בלחיצה על שורה -> שולחים את ה-period ל-API כ-param date ומקבלים פרטי השעות של אותו יום
  const handleTableRowClick = async (row: any) => {
    const periodValue = row.period;
    if (!periodValue) return;

    setSelectedDayPeriod(periodValue);
    setSelectedDayData(null);
    setErrorDay(null);
    setLoadingDay(true);

    try {
      const url = new URL(`${API_BASE}/parking-stats/stats`);
      // שולחים פרמטר date=periodValue; ה-backend ידע לסנן לפי אותו יום ולהחזיר שבירת שעות
      url.searchParams.set('date', periodValue);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Invalid response format: expected array');

      const mapped: ParkingStatItem[] = json.map((item: any) => {
        const date = parseISO(item.period); // item.period צפוי להיות 'YYYY-MM-DD HH:00' ברמת שעה
        return {
          day: format(date, 'd'),
          hour: format(date, 'HH:00'),
          period: item.period,
          monthYear: format(date, 'MMM yyyy'),
          entries: Number(item.entries) || 0,
          exits: Number(item.exits) || 0,
        };
      });

      setSelectedDayData(mapped);
    } catch (e: any) {
      setErrorDay(e.message ?? 'Unknown error');
    } finally {
      setLoadingDay(false);
    }
  };

  // Build tableColumns and tableRows from fetched data:
  // mainTableColumns: בכותרת הראשית נראה "Day" במקום "Period"
  const mainTableColumns = [
    { id: 'period', label: 'Day' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ];

  // hourly table columns used in drilldown view: 'Hour' במקום 'Period'
  const hourTableColumns = [
    { id: 'period', label: 'Hour' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ];

  const tableRows = data.map((d, idx) => ({
    id: idx + 1,           // unique id for DataTable
    period: d.period,
    entries: d.entries,
    exits: d.exits,
    day: d.day,
    hour: d.hour,
    monthYear: d.monthYear,
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* no toggle button */}

      {/* drilldown view — hourly data for selected day */}
      {selectedDayData ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            {/* <h3>Report for {selectedDayPeriod}</h3> */}
            <Button variant="outlined" onClick={() => { setSelectedDayData(null); setSelectedDayPeriod(null); setErrorDay(null); }}>
              Back
            </Button>
          </div>

          <GenericStatsChart
            data={selectedDayData}
            xKey="hour"
            barKeys={['entries', 'exits']}
            pieKeys={['entries', 'exits']}
            xLabel={`Hourly breakdown for ${selectedDayPeriod}`}
            title={`Hourly report for ${selectedDayPeriod}`}
            tableColumns={hourTableColumns}
            chartRowsCount={18}
          />
        </div>
      ) : (
        
        <GenericStatsChart
          data={data}
          xKey={xKey}
          barKeys={['entries', 'exits']}
          pieKeys={['entries', 'exits']}
          xLabel={xLabel}
          tableColumns={mainTableColumns} 
          tableRows={tableRows}
          title={`Parking Entries and Exits`}
          chartRowsCount={7}
          onTableRowClick={handleTableRowClick}
        />
      )}

      {loadingDay && <div style={{ marginTop: 8 }}>Loading day details...</div>}
      {errorDay && <div style={{ color: 'red', marginTop: 8 }}>Error loading day details: {errorDay}</div>}
    </>
  );
};

export default ParkingStatsPage;