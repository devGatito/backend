import { NotificacionesRepository } from "../../models/notificaciones/notificaciones.js";

const notiRepo = new NotificacionesRepository();

const getNotificaciones = async (req, res) => {
    try {
        const { modulo } = req.body;
        const noti = await notiRepo.getNotificaciones(modulo);
        res.status(200).json(noti);
    } catch (error) {
        console.error("C-Error al obtener Notificaciones:", error);
        res.status(500).json({ error: "C-Error al obtener Notificaciones" });
    }
};

const EliminarNotificacion = async (req, res) => {
    try {
        const id = req.params.id;
        const noti = await notiRepo.EliminarNotificacion(parseInt(id));
        res.status(200).json(noti);
    } catch (error) {
        console.error("C-Error al eliminar Notificacion:", error);
        res.status(500).json({ error: "C-Error al eliminar Notificacion" });
    }
};

export { getNotificaciones, EliminarNotificacion };
