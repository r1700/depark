import { Router } from 'express';
import techniciansRoutes from './technicians';
import faultsRouter from './faults';
import Queue from './exit';
// import opcNodesRouter from './opcNodes';

const router : Router = Router();

router.use("/technicians", techniciansRoutes);
router.use('/fault', faultsRouter);
router.use('/WriteQueue', Queue);
// router.use('/opc-nodes', opcNodesRouter);

router.post('/:param', (req, res) => {          
    res.json({  value: req.body.value });
});



export default router;
