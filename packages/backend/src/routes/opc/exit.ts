import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {       
    res.json({  value: req.body.value });
});

export default router;