require('dotenv').config();
const jwt = require('jsonwebtoken');
const authModel = require('./authModel');

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
            }

            const user = await authModel.authenticate(email, password);

            if (!user) {
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: String(user.id),
                    email: user.email,



                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: "Login exitoso", token, name: user.name });
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = AuthController;
