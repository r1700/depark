import { Router } from 'express';
import supabase from '../services/connectToDB'; // ייבוא הלקוח של Supabase מהשירות

const router = Router();

// ה-API שמחזיר את הסטטיסטיקות של הכניסות והיציאות
router.get('/stats', async (req, res) => {
  try {
    // מוודאים שהערכים הם בסוגים הנכונים (string)
    const { startTime, endTime, userId } = req.query;
    console.log(`Received query parameters: startTime=${startTime}, endTime=${endTime}, userId=${userId}`);

    // אם לא צוין זמן התחלתי, נשתמש בזמן הנוכחי של היום
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

    // המרת ה-params לערכים הנכונים
    const start = startTime ? new Date(startTime as string).toISOString() : todayStart;
    const end = endTime ? new Date(endTime as string).toISOString() : todayEnd;

    console.log(`Fetching stats from ${start} to ${end} for user ${userId || 'all users'}`);

    // יצירת השאילתה לקבלת כל הרשומות
    const { data, error } = await supabase.rpc('get_parking_stats', {
  p_start: start,
  p_end: end,
  p_user_id: userId || null,
});

if (error) {
  return res.status(500).json({ error: error.message });
}

const { entries, exits } = data[0];
res.json({ entries, exits });
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
    res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
});


export default router;
