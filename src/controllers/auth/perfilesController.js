import { pool } from "../../config/db.js";

export const listarPerfiles = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM USUARIO'); 
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al listar perfiles:', err);
    res.status(500).json({ msg: "Error al obtener los perfiles." });
  }
};