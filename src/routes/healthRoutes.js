import { Router } from 'express';
import { executeQuery } from '../config/db.js';

const router = Router();

router.get('/db-check', async (req, res) => {
  try {
    const result = await executeQuery('SELECT 1 AS test');
    res.json({ 
      status: 'DB Connection OK',
      testResult: result.recordset[0].test 
    });
  } catch (err) {
    res.status(500).json({
      status: 'DB Connection Failed',
      error: err.message
    });
  }
});

export default router;