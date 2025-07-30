import { Router } from 'express';

const router = Router();
          console.log('Signup request received');

// router.get('/', (req, res) => {

//   res.json({
//     success: false,
//     data: {
//       status: 'healthy',
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//       environment: process.env.NODE_ENV || 'development'
//     }
//   });
// });
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  return  res.json({
    success: true
   
  });
});


export default router;
