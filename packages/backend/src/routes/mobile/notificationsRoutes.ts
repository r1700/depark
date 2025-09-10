import express, { Router } from 'express';
import { Notification } from '../../model/database-models/notifications.model'; 

const router : Router = express.Router();


router.get('/', async (req, res) => {
  const baseuser_id = req.query.baseuser_id;

  if (!baseuser_id) {
    return res.status(400).send('Error: baseuser_id is required');
  }

  
  try {
    const notifications = await Notification.findAll({
      where: { baseuser_id: baseuser_id },
      order: [['timestamp', 'DESC']],
      limit: 20,
    });

    
    if (notifications.length === 0) {
      return res.status(404).send('No notifications found for the user');
    }

    res.json(notifications);
  } catch (err) {
    console.error('Error retrieving notifications:', err);
    res.status(500).send('Error retrieving notifications');
  }
});


router.post('/mark-read', async (req, res) => {
  const { notificationIds } = req.body;

  if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
    return res.status(400).send('Error: notificationIds should be a non-empty array');
  }

  try {
    await Notification.update(
      { read: true },
      {
        where: {
          id: notificationIds,
        },
      }
    );

    res.status(200).send('Notifications marked as read');
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).send('Error marking notifications as read');
  }
});

export default router;
