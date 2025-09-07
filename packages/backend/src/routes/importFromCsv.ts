import { Router } from 'express';

import { uploadGenericCsv } from '../utils/importFromCsv';    

const router = Router();

router.post('/import-csv', uploadGenericCsv);

export default router;

