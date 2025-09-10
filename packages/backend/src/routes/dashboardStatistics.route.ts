import express, { Router } from 'express';
import {
  getUserAndCarStats,
  getSystemHealthStatsWithChange,
  ActiveRetrievalRequests
} from '../../src/services/dashboard/dashboardStatistics.service';

const router: Router = express.Router();

router.get('/userAndCarStats', async (req, res) => {
  try {
    const stats = await getUserAndCarStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/systemHealthStats', async (req, res) => {
  try {
    const stats = await getSystemHealthStatsWithChange();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/ActiveRetrievalRequests', async (req, res) => {
  let stats;
  try {
    stats = await ActiveRetrievalRequests();
    console.log('ActiveRetrievalRequests stats:', stats);
    res.json(stats)
  }
  catch (error) {
    res.status(500).json({ error: 'fetching ActiveRetrievalRequests is failed' });
  }
});

export default router;
