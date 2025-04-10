export const obtenerHorasTrabajadas = async (mecanicoId, fechaInicio, fechaFin) => {
    // Lógica para obtener las horas trabajadas por un mecánico en un rango de fechas
    const query = `SELECT * FROM horas_mecanico WHERE mecanico_id = ? AND fecha BETWEEN ? AND ?`;
    const horas = await db.query(query, [mecanicoId, fechaInicio, fechaFin]);
    return horas;
  };
  