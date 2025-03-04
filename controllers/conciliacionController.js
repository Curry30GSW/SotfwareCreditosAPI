const { obtenerCreditosPagares } = require('../models/conciliacionModel');

const getPrimerUltimoCreditoMes = async (req, res) => {
    try {
        const resultado = await obtenerCreditosPagares();

        if (!resultado) {
            return res.status(404).json({ success: false, message: 'No se encontraron datos.' });
        }

        // Conversión segura de BigInt a Number (siempre existe un valor, aunque sea 0n)
        const MinimoID = resultado.MinimoID ? resultado.MinimoID.toString() : null;
        const MaximoID = resultado.MaximoID ? resultado.MaximoID.toString() : null;
        const Anulados = Number(resultado.Anulados);
        const Rechazados = Number(resultado.Rechazados);
        const Aprobados = Number(resultado.Aprobados);

        return res.status(200).json({
            success: true,
            MinimoID,
            MaximoID,
            Anulados,
            Rechazados,
            Aprobados
        });

    } catch (error) {
        console.error('❌ Error en getPrimerUltimoCreditoMes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los consecutivos',
            error: error.message
        });
    }
};

module.exports = { getPrimerUltimoCreditoMes };
