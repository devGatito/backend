import { DashboardRepository } from '../../models/finanzas/Dashboard.js';

const DashRepo = new DashboardRepository();

const getGanaciaMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGanaciaMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error al obtener datos:", error);
        res.status(500).json({ error: "C-Error al obtener datos" });
    }
};

const getGastoMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGastoMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error al obtener datos:", error);
        res.status(500).json({ error: "C-Error al obtener datos" });
    }
};

export { getGanaciaMes, getGastoMes };