import {
    obtenerVehiculos,
    insertarVehiculo,
    modificarVehiculo,
    eliminarVehiculoPorId
  } from '../../models/flujo/vehiculos.model.js';
  
  export async function listarVehiculos(req, res) {
    try {
      const vehiculos = await obtenerVehiculos();
      res.json(vehiculos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar vehículos' });
    }
  }
  
  export async function crearVehiculo(req, res) {
    try {
      const id = await insertarVehiculo(req.body);
      res.status(201).json({ message: 'Vehículo registrado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar vehículo' });
    }
  }
  
  export async function actualizarVehiculo(req, res) {
    try {
      await modificarVehiculo(req.params.id, req.body);
      res.json({ message: 'Vehículo actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar vehículo' });
    }
  }
  
  export async function eliminarVehiculo(req, res) {
    try {
      await eliminarVehiculoPorId(req.params.id);
      res.json({ message: 'Vehículo eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
  }
  