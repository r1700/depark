import express from 'express';
import http from 'http';
import cors from 'cors';  
import { Server as socketIo } from 'socket.io';  
import { Notification } from '../../model/database-models/notifications.model';  
import bodyParser from 'body-parser'; 
import notifications from "../../routes/mobile/notificationsRoutes"; 

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


app.use(bodyParser.json()); 


io.on('connection', (socket) => {
  console.log('A user connected');


  socket.on('send-notification', async (notification) => {
    try {
     
      io.emit('notification', notification);

    
      await Notification.create({
        baseuser_id: notification.userId,
        type: notification.type,
        message: notification.message,
        timestamp: notification.timestamp,
        read: false,
      });

      console.log('Notification saved to DB');
    } catch (err) {
      console.error('Error processing notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
app.use("/notifications", notifications);


app.get('/notifications', async (req, res) => {
  const baseuser_id = Number(req.query.baseuser_id); 

  if (isNaN(baseuser_id)) {  
    return res.status(400).send('Invalid user ID');
  }

  try {
    
    const notifications = await Notification.findAll({
      where: { baseuser_id: baseuser_id },
      order: [['timestamp', 'DESC']],  
      limit: 20,
    });
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).send('Error fetching notifications');
  }
});



 
