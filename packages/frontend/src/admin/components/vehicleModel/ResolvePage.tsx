import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

const API_BASE = 'http://localhost:3001';

type YearOption = {
  key: string;
  label: string;
  from?: number;
  to?: number;
};
const YEAR_OPTIONS: YearOption[] = [
  { key: '2010-2015', label: '2010 - 2015', from: 2010, to: 2015 },
  { key: '2016-2020', label: '2016 - 2020', from: 2016, to: 2020 },
  { key: '2021-2025', label: '2021 - 2025', from: 2021, to: 2025 },
  { key: 'custom', label: 'Custom' },
];

type VehicleForm = {
  make: string;
  model: string;
  yearKey: string;
  from: string;
  to: string;
  height: string;
  width: string;
  length: string;
  weight: string;
};

const initialForm: VehicleForm = {
  make: '',
  model: '',
  yearKey: '',
  from: '',
  to: '',
  height: '',
  width: '',
  length: '',
  weight: '',
};

type VehicleModel = {
  id: number;
  make: string;
  model: string;
  year_range?: { from: number; to: number } | null;
  dimensions?: { height?: number | null; width?: number | null; length?: number | null; weight?: number | null } | null;
};

const ResolvePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedLicensePlate = (location.state as any)?.license_plate ?? null;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<VehicleForm>(initialForm);

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);
  const [selectedModelId, setSelectedModelId] = useState<string>(''); // store as string for select value

  useEffect(() => {
    let mounted = true;

    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        // NOTE: models endpoint is mounted under /api/unknown-vehicles/models
        const r = await fetch(`${API_BASE}/api/unknown-vehicles/models`, { credentials: 'include' });
        const json = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(json?.error || json?.message || `Server ${r.status}`);
        }
        if (mounted) setModels(Array.isArray(json) ? json : []);
      } catch (e: any) {
        console.error('fetch models error', e);
      } finally {
        if (mounted) setModelsLoading(false);
      }
    };

    const fetchVehicle = async () => {
      if (!id) {
        setLoading(false);
        setForm(initialForm);
        return;
      }
      try {
        // NOTE: vehicle GET is mounted under /api/unknown-vehicles/:id
        const res = await fetch(`${API_BASE}/api/unknown-vehicles/${id}`, { credentials: 'include' });
        let json: any = null;
        try { json = await res.json(); } catch { json = null; }
        if (!res.ok) {
          if (res.status === 404) {
            setForm(initialForm);
            setLoading(false);
            return;
          }
          throw new Error(json?.error || json?.message || `Server ${res.status}`);
        }

        const vm_make = (json as any).vm_make ?? (json as any).make ?? '';
        const vm_model = (json as any).vm_model ?? (json as any).model ?? '';
        const vm_year_range = (json as any).vm_year_range ?? (json as any).year_range ?? null;
        const vm_dimensions = (json as any).vm_dimensions ?? (json as any).dimensions ?? {};
        const vm_id = (json as any).vm_id ?? null;

        let yearKey = '';
        let fromStr = '';
        let toStr = '';
        if (vm_year_range && typeof vm_year_range === 'object') {
          const fromNum = vm_year_range.from;
          const toNum = vm_year_range.to;
          if (Number.isInteger(fromNum) && Number.isInteger(toNum)) {
            const match = YEAR_OPTIONS.find(o => o.from === fromNum && o.to === toNum);
            if (match) {
              yearKey = match.key;
            } else {
              yearKey = 'custom';
              fromStr = String(fromNum);
              toStr = String(toNum);
            }
          }
        }

        if (mounted) {
          setForm({
            make: vm_make,
            model: vm_model,
            yearKey,
            from: fromStr,
            to: toStr,
            height: vm_dimensions?.height != null ? String(vm_dimensions.height) : '',
            width: vm_dimensions?.width != null ? String(vm_dimensions.width) : '',
            length: vm_dimensions?.length != null ? String(vm_dimensions.length) : '',
            weight: vm_dimensions?.weight != null ? String(vm_dimensions.weight) : '',
          });
          setSelectedModelId(vm_id ? String(vm_id) : '');
        }
      } catch (e: any) {
        console.error('fetch vehicle error', e);
        if (mounted) setError(e?.message ?? 'Failed to load vehicle');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchModels().finally(() => {});
    fetchVehicle().finally(() => {});

    return () => { mounted = false; };
  }, [id]);

  const handleSelectModel = (modelIdStr: string) => {
    if (!modelIdStr) {
      setSelectedModelId('');
      setForm(initialForm);
      return;
    }
    const modelId = Number(modelIdStr);
    const found = models.find(m => m.id === modelId);
    if (!found) {
      setSelectedModelId('');
      return;
    }
    let yearKey = '';
    let fromStr = '';
    let toStr = '';
    if (found.year_range && typeof found.year_range === 'object') {
      const fromNum = found.year_range.from;
      const toNum = found.year_range.to;
      if (Number.isInteger(fromNum) && Number.isInteger(toNum)) {
        const match = YEAR_OPTIONS.find(o => o.from === fromNum && o.to === toNum);
        if (match) {
          yearKey = match.key;
        } else {
          yearKey = 'custom';
          fromStr = String(fromNum);
          toStr = String(toNum);
        }
      }
    }
    setSelectedModelId(modelIdStr);
    setForm({
      make: found.make ?? '',
      model: found.model ?? '',
      yearKey,
      from: fromStr,
      to: toStr,
      height: found.dimensions?.height != null ? String(found.dimensions.height) : '',
      width: found.dimensions?.width != null ? String(found.dimensions.width) : '',
      length: found.dimensions?.length != null ? String(found.dimensions.length) : '',
      weight: found.dimensions?.weight != null ? String(found.dimensions.weight) : '',
    });
  };

  const handleFieldChange = (patch: Partial<VehicleForm>) => {
    setForm(f => ({ ...f, ...patch }));
    if (patch.make !== undefined || patch.model !== undefined) {
      setSelectedModelId('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handleSave = async () => {
    setError(null);
    const make = form.make.trim();
    const modelVal = form.model.trim();
    // If no existing model selected, require make/model
    if (!selectedModelId) {
      if (!make || !modelVal) {
        setError('Make and model required');
        return;
      }
    }

    if (!form.yearKey) {
      setError('Year range required');
      return;
    }

    let fromNum: number | null = null;
    let toNum: number | null = null;
    if (form.yearKey === 'custom') {
      const f = Number(form.from);
      const t = Number(form.to);
      if (!Number.isInteger(f) || !Number.isInteger(t) || f > t) {
        setError('Invalid custom year range');
        return;
      }
      fromNum = f;
      toNum = t;
    } else {
      const opt = YEAR_OPTIONS.find(o => o.key === form.yearKey);
      if (!opt) {
        setError('Invalid year range selection');
        return;
      }
      fromNum = opt.from ?? null;
      toNum = opt.to ?? null;
    }

    const payload: any = {
      // always provide make/model (server code you have expects make/model)
      make: make || '',
      model: modelVal || '',
      year_range: (fromNum != null && toNum != null) ? { from: fromNum, to: toNum } : null,
      dimensions: {
        height: form.height !== '' ? Number(form.height) : null,
        width: form.width !== '' ? Number(form.width) : null,
        length: form.length !== '' ? Number(form.length) : null,
        weight: form.weight !== '' ? Number(form.weight) : null,
      },
    };

    if (id) payload.vehicle_id = Number(id);
    else if (passedLicensePlate) payload.license_plate = passedLicensePlate;

    if (selectedModelId) {
      // include existing_model_id for clarity (server may ignore it but it's harmless)
      payload.existing_model_id = Number(selectedModelId);
    }

    // optional source (you can adjust)
    payload.source = 3;

    setSaving(true);
    try {
      // POST to resolve under /api/unknown-vehicles/resolve
      const r = await fetch(`${API_BASE}/api/unknown-vehicles/resolve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await r.json().catch(() => null);
      if (!r.ok) {
        throw new Error(json?.error || json?.message || `Server ${r.status}`);
      }
      const message = json?.message ?? 'Model added successfully';
      navigate('/admin/layout/unknown-vehicles', { state: { success: true, message } });
    } catch (e: any) {
      console.error('save error', e);
      setError(e?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{id ? `Resolve Vehicle ${id}` : 'Resolve Vehicle'}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box sx={{ mt: 1 }}>
            {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'repeat(12, 1fr)',
                alignItems: 'start',
              }}
            >
              <Box sx={{ gridColumn: 'span 12' }}>
                <TextField
                  select
                  fullWidth
                  label={modelsLoading ? 'Loading models...' : 'Select existing model (optional)'}
                  value={selectedModelId}
                  onChange={(e) => handleSelectModel(e.target.value)}
                >
                  <MenuItem value="">-- Create new / none --</MenuItem>
                  {models.map(m => (
                    <MenuItem key={m.id} value={String(m.id)}>
                      {`${m.make ?? '-'} ${m.model ?? '-'}${m.year_range ? ` (${m.year_range.from}-${m.year_range.to})` : ''}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ gridColumn: 'span 6' }}>
                <TextField fullWidth label="Make" value={form.make} onChange={(e) => handleFieldChange({ make: e.target.value })} />
              </Box>
              <Box sx={{ gridColumn: 'span 6' }}>
                <TextField fullWidth label="Model" value={form.model} onChange={(e) => handleFieldChange({ model: e.target.value })} />
              </Box>

              <Box sx={{ gridColumn: 'span 3' }}>
                <TextField fullWidth label="Height" value={form.height} onChange={(e) => handleFieldChange({ height: e.target.value })} />
              </Box>
              <Box sx={{ gridColumn: 'span 3' }}>
                <TextField fullWidth label="Width" value={form.width} onChange={(e) => handleFieldChange({ width: e.target.value })} />
              </Box>
              <Box sx={{ gridColumn: 'span 3' }}>
                <TextField fullWidth label="Length" value={form.length} onChange={(e) => handleFieldChange({ length: e.target.value })} />
              </Box>
              <Box sx={{ gridColumn: 'span 3' }}>
                <TextField fullWidth label="Weight" value={form.weight} onChange={(e) => handleFieldChange({ weight: e.target.value })} />
              </Box>

              <Box sx={{ gridColumn: 'span 6' }}>
                <TextField
                  select
                  fullWidth
                  label="Year range"
                  value={form.yearKey}
                  onChange={(e) => handleFieldChange({ yearKey: e.target.value })}
                >
                  <MenuItem value="">-- choose --</MenuItem>
                  {YEAR_OPTIONS.map(o => <MenuItem key={o.key} value={o.key}>{o.label}</MenuItem>)}
                </TextField>
              </Box>

              {form.yearKey === 'custom' && <>
                <Box sx={{ gridColumn: 'span 3' }}>
                  <TextField fullWidth label="From" value={form.from} onChange={(e) => handleFieldChange({ from: e.target.value })} />
                </Box>
                <Box sx={{ gridColumn: 'span 3' }}>
                  <TextField fullWidth label="To" value={form.to} onChange={(e) => handleFieldChange({ to: e.target.value })} />
                </Box>
              </>}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResolvePage;