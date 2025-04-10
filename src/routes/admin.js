import { Router } from 'express';
import { login } from '../controllers/administrativo/auth.controller.js';
import { getConnection } from '../config/db.js';

const router = Router();

router.post('/login', login);

// 👇 Agrega esto temporalmente:
router.get('/usuarios', async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM USUARIOS');
  res.json(result.recordset);
});

export default router;
