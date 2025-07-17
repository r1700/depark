
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;
// דוגמת מאגר נתונים (תוכל לשדרג את זה למסד נתונים אמיתי אם תרצה)
const users = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' }
];

// API שמחזיר פרטי משתמש לפי מזהה
app.get('/user/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);  // תופס את מזהה המשתמש מה-URL וממיר אותו למספר
  
  // חיפוש המשתמש במאגר הנתונים
  const user = users.find(u => u.id === userId);
  
  if (user) {
    // אם נמצא, מחזירים את פרטי המשתמש
    return res.json(user);
  } else {
    // אם לא נמצא, מחזירים שגיאה 404
    return res.status(404).json({ error: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


export default app;

