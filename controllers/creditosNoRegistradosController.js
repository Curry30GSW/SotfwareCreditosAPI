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
    },

    async registrarAuditoriaModulo  (req, res)  {

        try {
            const { nombre_usuario, rol } = req.body;
    
            // Capturar IP real desde la conexión
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    
            // Limpiar el "::ffff:" si existe
            if (ip && ip.startsWith('::ffff:')) {
                ip = ip.replace('::ffff:', '');
            }
    
            const detalle_actividad = `${nombre_usuario} ingreso al modulo CREDITOS NO REGISTRADO `;
    
             // Registrar en la auditoría
         await creditosNoRegistrados.registrarAuditoriaMod({ 
            nombre_usuario,
            rol,
            ip_usuario: ip,
            detalle_actividad
        });
        res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
        } catch(error){
            console.error('❌ Error al registrar auditoría de estado de crédito:', error);
            res.status(500).json({ status: 'error', message: 'No se pudo registrar la auditoría' });
        }
     
    
    }
};

module.exports = creditosNoRegistradosController;
