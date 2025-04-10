export const obtenerClientes = async (filtro) => {
    // Lógica para obtener clientes activos/inactivos o por filtro
    const query = `SELECT * FROM clientes WHERE estado = ?`; // consulta SQL básica
    const clientes = await db.query(query, [filtro]);
    return clientes;
  };
  