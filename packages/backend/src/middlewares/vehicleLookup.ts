

// middlewares/validateVehicle.ts

import { Request, Response, NextFunction } from 'express';

export const validateVehicleLookup = (req: Request, res: Response, next: NextFunction) => {
    const { licensePlate, timestamp, opcRequestId } = req.body;

    if (typeof licensePlate !== 'string' || !licensePlate.trim()) {
        return res.status(400).json({ found: false, approved: false, error: 'לוחית רישוי חייבת להיות מחרוזת לא ריקה' });
    }

    // אם יש צורך לבדוק את timestamp ו-opcRequestId, ניתן לבצע בדיקות נוספות כאן

    next();
};
