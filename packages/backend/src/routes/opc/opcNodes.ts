import { Router } from 'express';
import {
  createOpcNode,
  listOpcNodes,
  getOpcNodeById,
  updateOpcNode,
  removeOpcNode,
  getNodeIdByName
} from '../../services/opcNode.service';

const r = Router();

// GET /api/opc-nodes?search=...
r.get('/', async (req, res, next) => {
console.log("I am hear !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
 console.log("--------------------------------------------------------------------------------------------------\n------------------------------------------------------------------------------")
  try {
    const data = await listOpcNodes({ search: String(req.query.search || '') || undefined });
    res.json(data);
  } catch (e) { next(e); }
});

// GET /api/opc-nodes/:id
r.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const row = await getOpcNodeById(Number(req.params.id));
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (e) { next(e); }
});

// GET /api/opc-nodes/by-name/:nodeName  →  מחזיר רק nodeId
r.get('/by-name/:nodeName', async (req, res, next) => {
  try {
    const nodeId = await getNodeIdByName(decodeURIComponent(req.params.nodeName));
    if (!nodeId) return res.status(404).json({ message: 'Not found' });
    res.json({ nodeId });
  } catch (e) { next(e); }
});

// POST /api/opc-nodes
r.post('/', async (req, res, next) => {
  console.log("I am hear !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
 console.log("--------------------------------------------------------------------------------------------------\n------------------------------------------------------------------------------")
  try {
    const { nodeName, nodeId, description } = req.body || {};
    if (!nodeName || !nodeId) return res.status(400).json({ message: 'nodeName & nodeId required' });
    const created = await createOpcNode({ nodeName, nodeId, description });
    res.status(201).json(created);
  } catch (e: any) {
    if (e?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'nodeName must be unique' });
    }
    next(e);
  }
});

// PUT /api/opc-nodes/:id
r.put('/:id(\\d+)', async (req, res, next) => {
  try {
    const updated = await updateOpcNode(Number(req.params.id), req.body || {});
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE /api/opc-nodes/:id
r.delete('/:id(\\d+)', async (req, res, next) => {
  try {
    const count = await removeOpcNode(Number(req.params.id));
    if (!count) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default r;
