import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import GenericStatsChart from '../../../components/graph/GenericStatsChart';
import { fetchSurfaceStats, SurfaceStatItem } from './surfaceStatsSlice';
import { Button, CircularProgress } from '@mui/material';

const SurfaceStatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: rawData, loading, error } = useAppSelector((s) => (s as any).surfaceStats as { data: SurfaceStatItem[]; loading: boolean; error: string | null });

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    dispatch(fetchSurfaceStats());
  }, [dispatch, retry]);

  const data: SurfaceStatItem[] = useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    return rawData.map((d: any) => ({
      spot_number: String(d.spot_number ?? d.spotNumber ?? ''),
      entries: Number(d.entries) || 0,
      exits: Number(d.exits) || 0,
    }));
  }, [rawData]);

  const tableColumns = useMemo(() => [
    { id: 'spot_number', label: 'Spot Number' },
    { id: 'entries', label: 'Entries' },
    { id: 'exits', label: 'Exits' },
  ], []);

  const tableRows = useMemo(() => data.map((d, idx) => ({
    id: idx + 1,
    spot_number: d.spot_number,
    entries: d.entries,
    exits: d.exits,
  })), [data]);

  // Error UI
  const renderError = useCallback((msg: string, onRetry: () => void) => (
    <div style={{ color: 'red', margin: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{msg}</span>
      <Button variant="outlined" size="small" onClick={onRetry} disabled={loading}>
        Try again
        {loading && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
      </Button>
    </div>
  ), [loading]);

  // Loading indicator
  const renderLoading = useCallback(() => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40 }}>
      <CircularProgress size={22} />
    </div>
  ), []);

  if (loading) return renderLoading();
  if (error) return renderError(`Error: ${String(error)}`, () => setRetry(r => r + 1));

  return (
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
  );
};

export default SurfaceStatsPage;