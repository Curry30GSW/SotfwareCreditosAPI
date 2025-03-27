const analisisModel = require('../models/analisisConteoParcialModel');

const obtenerDatosFechasFijas = async (req, res) => {
    try {
        let { agencia } = req.params;
        agencia = parseInt(agencia, 10);

        if (isNaN(agencia)) {
            return res.status(400).json({ error: 'El parámetro agencia debe ser un número válido' });
        }

        console.log("📌 Agencia recibida:", agencia);

        const resultado = await analisisModel.obtenerDetalleAgenciaConFechasDinamicas(agencia);
        res.json(resultado);
    } catch (error) {
        console.error("❌ Error en obtenerDatosFechasFijas:", error);
        res.status(500).json({ error: 'Error al obtener detalle de agencia con fechas dinámicas' });
    }
};

const obtenerAnalisisFechasFijas = async (req, res) => {
    try {
        let { estado, agencia } = req.params;
        agencia = parseInt(agencia, 10);

        if (isNaN(agencia)) {
            return res.status(400).json({ error: 'El parámetro agencia debe ser un número válido' });
        }

        console.log("📌 Agencia recibida detalles:", agencia, "Estado:", estado);

        const resultado = await analisisModel.obtenerAnalisisPorEstadoConFechasDinamicas(estado, agencia);
        res.json(resultado);
    } catch (error) {
        console.error("Error en obtenerAnalisisFechasFijas:", error);
        res.status(500).json({ error: 'Error al obtener análisis con fechas dinámicas' });
    }
};

// 🔹 Verifica que ambas funciones se estén exportando correctamente
module.exports = { obtenerDatosFechasFijas, obtenerAnalisisFechasFijas };
