const { obtenerCreditosCedula, registrarAuditoriaMod } = require('../models/creditosCedulaModel');

const creditosCedulaController = {
    async mostrarCredito(req, res) {
        try {
            const cedula = req.params.cedula.toString();

            if (!cedula) {
                return res.status(400).json({ error: 'La cédula es obligatoria.' });
            }

            const creditosCedula = await obtenerCreditosCedula(cedula);

            if (creditosCedula.length === 0) {
                return res.status(404).json({ message: 'No hay informacion de la cedula' })
            }
            res.status(200).json(creditosCedula)
        } catch (e) {

            console.error('❌ Error al listar créditos no registrados:', e);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async registrarAuditoriaModulo(req, res) {

        try {
            const { nombre_usuario, rol } = req.body;

            // Capturar IP real desde la conexión
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

            // Limpiar el "::ffff:" si existe
            if (ip && ip.startsWith('::ffff:')) {
                ip = ip.replace('::ffff:', '');
            }

            const detalle_actividad = `${nombre_usuario} ingresó al modulo HISTORIAL CREDITOS `;

            // Registrar en la auditoría
            await registrarAuditoriaMod(
                nombre_usuario,
                rol,
                ip,
                detalle_actividad
            );

            res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
        } catch (error) {
            console.error('❌ Error al registrar auditoría de estado de crédito:', error);
            res.status(500).json({ status: 'error', message: 'No se pudo registrar la auditoría' });
        }


    },




}

module.exports = creditosCedulaController;