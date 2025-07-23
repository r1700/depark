import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// API Endpoint לקבלת המשקל והגובה לפי הדגם
router.get('/get-vehicle', async (req, res) => {
    const degemNm = req.query.degem_nm as string;  // מקבל את הדגם מה-query parameter

    // אם הדגם לא הוזן, נחזיר שגיאה
    if (!degemNm) {
        return res.status(400).json({ error: 'נא להזין דגם רכב.' });
    }

    try {
        // כתובת ה-API של המידע על הרכב
        const url = 'https://data.gov.il/api/3/action/datastore_search';
        
        // פרמטרים לשליחה ב-API
        const params = {
            resource_id: '142afde2-6228-49f9-8a29-9b6c3a0cbe40',  // ה-resource_id של המידע על הרכב
            q: degemNm,  // הדגם שהוזן
            limit: 5  // מספר תוצאות מקסימלי
        };

        // שליחת בקשה ל-API
        const response = await axios.get(url, { params });

        // עיבוד התגובה מה-API
        const vehicleData = response.data.result.records;

        if (vehicleData.length > 0) {
            // מוציא את המשקל והגובה מהנתונים שהתקבלו
            const vehicle = vehicleData[0];
            const { mishkal_kolel, gova } = vehicle;  // המשקל והגובה שמתקבלים מהנתונים

            return res.json({
                degem_nm: degemNm,
                mishkal_kolel: mishkal_kolel || 'לא זמין',  // אם אין משקל, נחזיר "לא זמין"
                gova: gova || 'לא זמין'  // אם אין גובה, נחזיר "לא זמין"
            });
        } else {
            return res.status(404).json({ error: 'לא נמצאו תוצאות עבור הדגם.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'שגיאה פנימית בשרת.' });
    }
});

export default router;
