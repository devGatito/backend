import * as clienteService from '../../services/clienteService.js';
import * as ventasService from '../../services/ventasService.js';
import * as horasMecanicoService from '../../services/horasMecanicoService.js';
import * as exportService from '../../services/exportService.js';

// 1. Reporte de clientes activos/inactivos
export const generarReporteClientes = async (req, res) => {
  try {
    const { filtro } = req.query; // puede ser por nombre, apellido, estado (activo/inactivo)
    const clientes = await clienteService.obtenerClientes(filtro);
    return res.status(200).json({ data: clientes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte de clientes" });
  }
};

// 2. Reporte de ventas
export const generarReporteVentas = async (req, res) => {
  try {
    const { periodo } = req.query; // Mensual o Anual
    const ventas = await ventasService.obtenerVentas(periodo);
    return res.status(200).json({ data: ventas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte de ventas" });
  }
};

// 3. Reporte de horas trabajadas de mecánicos
export const generarReporteHorasMecanico = async (req, res) => {
  try {
    const { mecanicoId, fechaInicio, fechaFin } = req.query;
    const horas = await horasMecanicoService.obtenerHorasTrabajadas(mecanicoId, fechaInicio, fechaFin);
    return res.status(200).json({ data: horas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte de horas de mecánico" });
  }
};

// 4. Exportar reportes
export const exportarReporte = async (req, res) => {
  try {
    const { formato, reporteId } = req.query; // Formato puede ser .xlsx o .pdf
    const data = await obtenerDatosReporte(reporteId); // Obtenemos el reporte según el ID
    const archivoExportado = await exportService.exportar(reporteId, data, formato);
    res.download(archivoExportado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al exportar reporte" });
  }
};
