import { Router, Request, Response } from 'express';
import Parkingsessions from '../model/database-models/parkingsessions.model';
import { broadcastEvent } from '../services/WS-server';
const router = Router();
router.post('/create', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // validation of required fields
    if (!body.baseuser_id || !body.vehicle_id || !body.parking_spots_id || !body.license_plate || !body.surface_spot || !body.status || !body.entry_time)
      return res.status(400).json({ success: false, error: 'missing required fields' });
    const created = await Parkingsessions.create(body);
    // send WebSocket event to all connected clients about the new parking session
    broadcastEvent({
      event: 'parkingsession_created',
      data: {body: created.get({ plain: true }) }
    });
    return res.status(201).json({ success: true,event: 'parkingsession_created', data: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'create_failed' });
  }
});
router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, error: 'not found or invalid_id' });
    const deletedCount = await Parkingsessions.destroy({ where: { id } });//return how many rows go to deleted
    if (deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'not found' });
    }
    // send WebSocket event to all connected clients about the new parking session
    broadcastEvent({
      event: 'parkingsession_deleted',
      data: { id: id }
    });
    return res.status(200).json({ success: true,event: 'parkingsession_deleted', data: id });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'deleted_failed' });
  }
});
router.patch('/update/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, error: 'not found or invalid_id' });
    const update = await Parkingsessions.findByPk(id);
    if (!update) {
      return res.status(404).json({ success: false, error: 'not_found' });
    }
    // feild allowed to update
    const allowed = [
      'status',
      'exit_time',
      'retrieval_request_time',
      'actual_retrieval_time',
      'pickup_spot',
      'requested_by'
    ];
    // build the update object only with allowed fields present in the request body
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'no_valid_fields' });
    }
    // Save to DB and wait for completion
    await update.update(updates);
    // send WebSocket event to all connected clients about the new parking session
    broadcastEvent({
      event: 'parkingsession_updated',
      data: update.get({ plain: true })
    });
    return res.status(200).json({ success: true,event: 'parkingsession_updated', data: id });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'deleted_failed' });
  }
});
export default router;