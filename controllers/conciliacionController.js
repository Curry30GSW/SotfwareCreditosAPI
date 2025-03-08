const { obtenerCreditosPagares, obtenerFiltroFecha } = require('../models/conciliacionModel');

const getPrimerUltimoCreditoMes = async (req, res) => {
    try {
        // Obtener fechas desde el frontend o usar las predeterminadas
        let { fechaInicio, fechaFin } = req.query;

        // Si no se envían fechas, usar el filtro automático del mes actual
        if (!fechaInicio || !fechaFin) {
            const fechas = obtenerFiltroFecha();
            fechaInicio = fechas.primerDia;
            fechaFin = fechas.ultimoDia;
        }

        const resultado = await obtenerCreditosPagares(fechaInicio, fechaFin);

        if (!resultado) {
            return res.status(404).json({ success: false, message: 'No se encontraron datos.' });
        }

        return res.status(200).json({
            success: true,
            MinimoID: resultado.MinimoID?.toString() || null,
            MaximoID: resultado.MaximoID?.toString() || null,
            Anulados: Number(resultado.Anulados),
            Rechazados: Number(resultado.Rechazados),
            Aprobados: Number(resultado.Aprobados)
        });

    } catch (error) {
        console.error('❌ Error en getPrimerUltimoCreditoMes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los créditos',
            error: error.message
        });
    }
};

module.exports = { getPrimerUltimoCreditoMes };
