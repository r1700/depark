import { Router } from 'express';

const router : Router = Router();

router.post('/:param', (req, res) => {       
    res.json({  value: req.body.value });
});

export default router;