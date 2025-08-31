import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import GenericStatsChart from '../../../components/graph/GenericStatsChart';
import { format, parseISO, isValid } from 'date-fns';
import { Button, CircularProgress } from '@mui/material';

import {
  fetchParkingStats,
  fetchParkingDayDetails,
  clearParkingDayDetails,
} from '../../pages/parkingStats/parkingStatsSlice';

interface ParkingStatItem {
  day: string;
  hour: string;
  period: string;
  monthYear: string;
  entries: number;
  exits: number;
}

const ParkingStatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: rawData,
    loading,
    error,
    dayData: rawDayData,
    dayLoading,
    dayError,
    selectedDay,
  } = useAppSelector((state) => state.parkingStats);

  // AbortControllers
  const mainAbortRef = useRef<AbortController | null>(null);
  const dayAbortRef = useRef<AbortController | null>(null);

  // UI state
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [retryMain, setRetryMain] = useState(0);
  const [retryDay, setRetryDay] = useState(0);

  // Main fetch with abort
  useEffect(() => {
    mainAbortRef.current?.abort();
    dispatch(fetchParkingStats(true));
    return () => {};
    // eslint-disable-next-line
  }, [dispatch, retryMain]);

  // Memoized data
  const data: ParkingStatItem[] = useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    return rawData.map((item: any) => {
      if (!item.period) {
        return {
          day: '',
          hour: '',
          period: '',
          monthYear: '',
          entries: Number(item.entries) || 0,
          exits: Number(item.exits) || 0,
        };
      }
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
  }, [rawData]);

  const selectedDayData: ParkingStatItem[] | null = useMemo(() => {
    if (!Array.isArray(rawDayData)) return null;
    return rawDayData.map((item: any) => {
      if (!item.period) {
        return {
          day: '',
          hour: '',
          period: '',
          monthYear: '',
          entries: Number(item.entries) || 0,
          exits: Number(item.exits) || 0,
        };
      }
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
  }, [rawDayData]);

  // xLabel
  const xKey = 'day';
  const xLabel = useMemo(() => {
    const monthEntries: Map<string, string> = new Map();
    data.forEach((d) => {
      if (!monthEntries.has(d.monthYear)) monthEntries.set(d.monthYear, d.period);
    });
    const monthsSorted = Array.from(monthEntries.entries())
      .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime())
      .map(([monthYear]) => monthYear);
    return monthsSorted.length > 0 ? monthsSorted.join(' / ') : '';
  }, [data]);

  // Table columns
  const mainTableColumns = useMemo(() => [
    { id: 'period', label: 'Day' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ], []);

  const hourTableColumns = useMemo(() => [
    { id: 'period', label: 'Hour' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ], []);

  const tableRows = useMemo(() => {
    return data.map((d, idx) => ({
      id: idx + 1,
      period: d.period,
      entries: d.entries,
      exits: d.exits,
      day: d.day,
      hour: d.hour,
      monthYear: d.monthYear,
    }));
  }, [data]);

  // Handlers
  const onTableRowClick = useCallback((row: any) => {
    if (dayLoading) return;
    if (!row || !row.period) return;
    let period = row.period;
    let parsed = parseISO(period);
    if (!isValid(parsed)) {
      try {
        period = format(new Date(period), 'yyyy-MM-dd');
        parsed = parseISO(period);
      } catch {}
    }
    if (!isValid(parsed)) return;
    setSelectedRow(period);
    dispatch(fetchParkingDayDetails(period));
  }, [dispatch, dayLoading]);

  const onBackFromDrilldown = useCallback(() => {
    if (dayLoading) return;
    dispatch(clearParkingDayDetails());
    setSelectedRow(null);
  }, [dispatch, dayLoading]);

  const handleTodayClick = useCallback(() => {
    if (dayLoading) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedRow(today);
    dispatch(fetchParkingDayDetails(today));
  }, [dispatch, dayLoading]);

  const friendlySelectedDay = useMemo(() => {
    if (!selectedDay) return '';
    const parsed = parseISO(selectedDay);
    if (isValid(parsed)) return format(parsed, 'd MMM yyyy');
    try {
      const d = new Date(selectedDay);
      if (isValid(d)) return format(d, 'd MMM yyyy');
    } catch {}
    return selectedDay;
  }, [selectedDay]);

  // determine if "Today" is already active
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const isTodayActive = (selectedRow === todayStr) || (selectedDay === todayStr);

  // Loading indicator
  const renderLoading = (size = 22) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40 }}>
      <CircularProgress size={size} />
    </div>
  );

  // Error UI
  const renderError = (msg: string, onRetry: () => void) => (
    <div style={{ color: 'red', margin: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{msg}</span>
      <Button variant="outlined" size="small" onClick={onRetry}>Try again</Button>
    </div>
  );

  // Highlight selected row
  const getRowProps = useCallback((row: any) => ({
    style: selectedRow && row.period === selectedRow ? { background: '#e3f2fd' } : undefined
  }), [selectedRow]);

  // Main render
  if (loading) return renderLoading();
  if (error) return renderError(`Error: ${String(error)}`, () => setRetryMain(r => r + 1));

  return (
    <>
      <div style={{ margin: 0, display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, justifyContent: 'flex-end' }}>
        {!isTodayActive && (
          <Button
            variant="outlined"
            onClick={handleTodayClick}
            size="small"
            disabled={dayLoading}
            style={{ minWidth: 90 }}
          >
            Today
            {dayLoading && !selectedDayData && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
          </Button>
        )}

        {selectedDayData && (
          <Button
            variant="outlined"
            onClick={onBackFromDrilldown}
            size="small"
            disabled={dayLoading}
            style={{ minWidth: 90, marginLeft: 8 }}
          >
            Back
            {dayLoading && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
          </Button>
        )}
      </div>

      {selectedDayData ? (
        <div>
          <div style={{ height: 8 }} /> {/* spacer */}
          <GenericStatsChart
            data={selectedDayData}
            xKey="hour"
            barKeys={['entries', 'exits']}
            pieKeys={['entries', 'exits']}
            xLabel={`Hourly breakdown for ${friendlySelectedDay}`}
            title={`Hourly report for ${friendlySelectedDay}`}
            tableColumns={hourTableColumns}
            chartRowsCount={18}
            tableRows={selectedDayData}
          />
          {dayLoading && renderLoading(18)}
          {dayError && renderError(`Error loading day details: ${String(dayError)}`, () => setRetryDay(r => r + 1))}
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
          onTableRowClick={dayLoading ? undefined : onTableRowClick}
        />
      )}
    </>
  );
};

export default ParkingStatsPage;