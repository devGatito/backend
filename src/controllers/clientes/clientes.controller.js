import {
    obtenerClientes,
    insertarCliente,
    modificarCliente,
    eliminarClientePorId
  } from '../../models/clientes/clientes.model.js';
  
  export async function listarClientes(req, res) {
    try {
      const clientes = await obtenerClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar clientes' });
    }
  }
  
  export async function crearCliente(req, res) {
    try {
      const id = await insertarCliente(req.body);
      res.status(201).json({ message: 'Cliente creado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }
  
  export async function actualizarCliente(req, res) {
    try {
      await modificarCliente(req.params.id, req.body);
      res.json({ message: 'Cliente actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }
  
  export async function eliminarCliente(req, res) {
    try {
      await eliminarClientePorId(req.params.id);
      res.json({ message: 'Cliente eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }
  