
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;
const users = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' }
];

app.get('/user/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);  
  
  const user = users.find(u => u.id === userId);
  
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


export default app;

