
import { Router, Request, Response, NextFunction } from 'express';
import { handleUserFilter } from '../services/userServices';

const router = Router();

console.log("✅ userFilter loaded");
console.log("✅ /api/userFilter/filter route loaded");


router.get('/filter', (req: Request, res: Response, next: NextFunction) => {
    const { status, max_cars_allowed_parking, created_at, updated_at, approved_at, last_login_at } = req.query;

 
    if (status !== undefined && isNaN(Number(status))) {
        return res.status(400).json({ error: "status must be a number" });
    }
    if (max_cars_allowed_parking !== undefined && isNaN(Number(max_cars_allowed_parking))) {
        return res.status(400).json({ error: "max_cars_allowed_parking must be a number" });
    }

   
    const dateFields = { created_at, updated_at, approved_at, last_login_at };
    for (const [field, value] of Object.entries(dateFields)) {
        if (value && typeof value === "string") {
            const parsed = Date.parse(value);
            if (isNaN(parsed)) {
                return res.status(400).json({ error: `${field} is not a valid date` });
            }
        }
    }

    next(); 
}, handleUserFilter);

export default router;
