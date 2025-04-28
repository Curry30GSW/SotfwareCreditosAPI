const authModel = require('./authModel');
const jwt = require('jsonwebtoken')

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
            }

            const user = await authModel.authenticate(email, password); // ✅ DIRECTO

            if (!user) {
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            const token = jwt.sign(
                {
                    id: String(user.id),
                    email: user.email,
                    rol: user.rol,
                    agenciau: user.agenciau
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            const ip = req.body.ip_usuario || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            await authModel.registrarAuditoria({
                nombre_usuario: user.name.trim().toUpperCase(),
                rol: user.rol,
                ip_usuario: ip,
                detalle_actividad: 'Inicio de sesión en el sistema'
            });

            res.json({
                message: "Login exitoso",
                token,
                name: user.name,
                rol: user.rol,
                agenciau: user.agenciau
            });
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    async logoutAuditoria(req, res) {
        try {
            const { nombre_usuario, rol } = req.body;
            const ip = req.body.ip_usuario || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            console.log('Recibido en logoutAuditoria:', { nombre_usuario, rol, ip });

            await authModel.registrarAuditoria({
                nombre_usuario,
                rol,
                ip_usuario: ip,
                detalle_actividad: 'Cierre de sesión en el sistema'
            });

            res.status(200).json({ message: 'Auditoría de cierre registrada' });
        } catch (error) {
            console.error('Error en logoutAuditoria:', error);
            res.status(500).json({ error: 'Error interno al registrar auditoría' });
        }
    }


}

module.exports = AuthController;
