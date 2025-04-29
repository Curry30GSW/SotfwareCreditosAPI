const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // 🔹 Buscar en headers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ redirect: '/SotfwareCreditos/conciliacion/login/login.html', message: "Acceso denegado. No hay token." });
    }

    const token = authHeader.split(' ')[1]; // Extraer solo el token


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ redirect: '/SotfwareCreditos/conciliacion/login/login.html', message: "Token inválido o expirado" });
    }
};

module.exports = verificarToken;
