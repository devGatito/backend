"use strict";

import { SolicitudRepository } from "../../models/inventario/solicitudProducto.js";

const SolicitudRepo = new SolicitudRepository();

// Obtener todas las solicitudes
export const getAllSolicitud = async (_req, res) => {
    try {
        const solicitud = await SolicitudRepo.getAllSolicitud(); // Get
        res.json(solicitud); // Return exitoso
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la solicitud" });
    }
};

// Registrar una nueva solicitud
export const addSolicitud = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { titulo, cuerpo, usuario } = req.body;
        // Llamar al método insertSolicitud para insertar el nuevo solicitud en la base de datos
        const nuevaSolicitud = await SolicitudRepo.insertSolicitud(titulo, cuerpo, usuario);
        // Respuesta exitosa con la solicitud insertada
        res.status(201).json({
            message: "Solicitud insertada exitosamente",
            solicitud: nuevaSolicitud,
        });
    } catch (error) {
        console.error("Error al insertar la solicitud:", error);
        res.status(500).json({ error: "Error al insertar la solicitud" });
    }
};

// Actualizar una solicitud
export const updateSolicitud = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { idSolicitud, aprobado } = req.body;
        // Llamar al método updateSolicitud para actualizar la solicitud
        const procesarSolicitud = await SolicitudRepo.updateSolicitud(idSolicitud, aprobado);
        // Respuesta exitosa
        res.status(200).json({
            message: "Solicitud procesada exitosamente",
            Res: procesarSolicitud,
        });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};
