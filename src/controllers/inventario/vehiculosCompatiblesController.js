"use strict";

import { VehiculoRepository } from "../../models/inventario/vehiculosCompatibles.js";

const vehiculosRepo = new VehiculoRepository();

// Obtener todas las Vehículos
export const getAllVehiculos = async (_req, res) => {
    try {
        const vehiculo = await vehiculosRepo.getAll(); // Get
        res.json(vehiculo); // Return exitoso
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los vehículos" });
    }
};

// Obtener un vehículo por ID
export const getVehiculoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const vehiculo = await vehiculosRepo.findById(id); // Get
        if (!vehiculo) {
            res.status(404).json({ error: "Vehículo no encontrado" }); // Return
        }
        res.json(vehiculo); // Return exitoso
    } catch (error) {
        console.error("Error en getVehiculoById:", error);
        res.status(500).json({ error: "Error al obtener el vehículo" });
    }
};
