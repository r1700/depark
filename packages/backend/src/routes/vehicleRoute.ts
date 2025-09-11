import axios from 'axios';
import { Router } from 'express';
import { addVehicle, updateVehicle } from '../utils/vehicle';

export const api = axios.create({
    baseURL: process.env.APP_BASE_URL,
    timeout: 5000,
});

const router : Router = Router();

router.post('/add', addVehicle);

router.put('/update', updateVehicle);


export default router;





