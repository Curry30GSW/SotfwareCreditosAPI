const creditosPendientesAS400 = require('../models/creditosPendientesModel');

const creditosPendientesController = {
    async obtenerCreditosPendientes(req, res) {
        try {
            const data = await creditosPendientesAS400.getCreditosPendientesAS400();
            const creditosLimpios = limpiarCreditos(data);
            res.json(creditosLimpios);
        } catch (error) {
            console.error('Error al obtener créditos pendientes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async contarCuentasPendientes(req, res) {
        try {
            const { mes } = req.params;
            const mesInt = parseInt(mes, 10);

            if (isNaN(mesInt) || mesInt < 0 || mesInt > 6) {
                return res.status(400).json({ error: 'Mes inválido. Debe estar entre 0 y 5.' });
            }

            const totalCuentas = await creditosPendientesAS400.contarCuentasPendientesAS400(mesInt);
            res.json({ total_cuentas: totalCuentas });
        } catch (error) {
            console.error('Error al contar cuentas pendientes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },


    async obtenerCreditosPorMes(req, res) {
        try {
            const { mes } = req.params;
            const mesInt = parseInt(mes, 10);

            if (isNaN(mesInt) || mesInt < 0 || mesInt > 6) {
                return res.status(400).json({ error: 'Mes inválido. Debe estar entre 0 y 5.' });
            }

            const data = await creditosPendientesAS400.getCreditosPendientesAS400(mesInt);

            // Verificar si los créditos incluyen la propiedad Score
            if (!data.every(credito => credito.hasOwnProperty('Score'))) {
                console.warn('Algunos créditos no tienen Score asignado');
            }

            res.json(data); // Enviar directamente los créditos con Score
        } catch (error) {
            console.error('Error al obtener créditos por mes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Función para limpiar los créditos
function limpiarCreditos(data) {
    return data.map(credito => ({
        DESC03: limpiarCampo(credito.DESC03),
        DIRE03: limpiarCampo(credito.DIRE03),
        DIST03: limpiarCampo(credito.DIST03),
        NCTA26: limpiarCampo(credito.NCTA26),
        NNIT05: limpiarCampo(credito.NNIT05),
        DESC05: limpiarCampo(credito.DESC05),
        FECH23: limpiarCampo(credito.FECH23),
        TCRE26: limpiarCampo(credito.TCRE26),
        CPTO26: limpiarCampo(credito.CPTO26),
        NCRE26: limpiarCampo(credito.NCRE26),
        NANA26: limpiarCampo(credito.NANA26),
        SCAP26: parseFloat(credito.SCAP26) || 0,
        TASA26: parseFloat(credito.TASA26) || 0,
        LAPS26: limpiarCampo(credito.LAPS26),
        FECN05: limpiarCampo(credito.FECN05),
        DESC06: limpiarCampo(credito.DESC06),
        CLAS06: limpiarCampo(credito.CLAS06),
        DESC04: limpiarCampo(credito.DESC04)
    }));
}

// Función auxiliar para limpiar espacios en los extremos
function limpiarCampo(valor) {
    return typeof valor === 'string' ? valor.trim() : valor;
}

module.exports = creditosPendientesController;
