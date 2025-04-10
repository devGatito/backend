export const obtenerVentas = async (periodo) => {
    // Lógica para obtener las ventas según el periodo (mensual o anual)
    const query = `SELECT * FROM ventas WHERE periodo = ?`; 
    const ventas = await db.query(query, [periodo]);
    return ventas;
  };
  