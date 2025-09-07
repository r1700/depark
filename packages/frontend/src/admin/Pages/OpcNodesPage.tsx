import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, Typography, Box, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert } from '@mui/material';
import DataTable from '../../components/table/table';

type OpcNode = {
  id: number;
  nodeName: string;
  nodeId: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};



const API_BASE = '/api/opc/opc-nodes';

export default function OpcNodesPage() {
  const [rows, setRows] = useState<OpcNode[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<OpcNode>>({ nodeName: '', nodeId: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // הוספת טוקן אם צריך
  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
    // return { 'Content-Type': 'application/json' };
  };

  const load = async () => {
    setLoading(true); setError('');
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_BASE}${q}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();
      setRows(data);
    } catch (e: any) {
      setError(e?.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      nodeName: (form.nodeName || '').trim(),
      nodeId: (form.nodeId || '').trim(),
      description: (form.description || '').trim()
    };
    if (!payload.nodeName || !payload.nodeId) {
      setError('nodeName and nodeId are required');
      return;
    }
    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `${method} failed`);
      }
      setForm({ nodeName: '', nodeId: '', description: '' });
      setEditingId(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    }
  };

  const onEdit = (row: OpcNode) => {
    setEditingId(row.id);
    setForm({ nodeName: row.nodeName, nodeId: row.nodeId, description: row.description || '' });
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Delete node?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const filtered = useMemo(() => rows, [rows]);

  const columns = [
    { id: 'nodeName', label: 'nodeName' },
    { id: 'nodeId', label: 'nodeId' },
    { id: 'description', label: 'description' },
  ];
  const data = { columns, rows: filtered };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 400, color: "primary.main" }}>
            OPC Nodes Management
          </Typography>
        </Box>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <TextField
            label="nodeName"
            value={form.nodeName || ''}
            onChange={e => setForm(f => ({ ...f, nodeName: e.target.value }))}
            size="small"
            required
          />
          <TextField
            label="nodeId"
            value={form.nodeId || ''}
            onChange={e => setForm(f => ({ ...f, nodeId: e.target.value }))}
            size="small"
            required
          />
          <TextField
            label="description"
            value={form.description || ''}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            size="small"
          />
          <Button onClick={load} variant="outlined">Search</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <Box textAlign="center"><CircularProgress /></Box>}

        <DataTable data={data} stickyColumns={['nodeName']} />

        {/* <Table>
          <TableHead>
            <TableRow>
              <TableCell>nodeName</TableCell>
              <TableCell>nodeId</TableCell>
              <TableCell>description</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.nodeName}</TableCell>
                <TableCell>{r.nodeId}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => onEdit(r)} size="small">Edit</Button>
                  <Button onClick={() => onDelete(r.id)} size="small" color="error" sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table> */}
      </Paper>
    </Container>
  );
}