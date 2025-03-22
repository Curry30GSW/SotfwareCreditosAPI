const creditosNoRegistrados = require('../models/creditosNoRegistradosModel');

const creditosNoRegistradosController = {
    async listarCreditosNoRegistrados(req, res) {
        try {
            const creditos = await creditosNoRegistrados.obtenerCreditosNoRegistradosFinal();
            res.json(creditos);
        } catch (error) {
            console.error('❌ Error al listar créditos no registrados:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = creditosNoRegistradosController;
