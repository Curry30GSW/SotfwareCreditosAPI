const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db');

async function authenticate(email, password) {
    try {
        const query = `
            SELECT email, name, password, rol, agenciau
            FROM users 
            WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
            AND email NOT IN ('chutata18@gmail.com')
        `;
        const users = await executeQuery(query, [email], 'PAGARES');

        if (users.length === 0) return null;

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
        throw error;
    }
}

async function registrarAuditoria({ nombre_usuario, rol, ip_usuario, detalle_actividad }) {
    const query = `
        INSERT INTO conciliacion_auditoria 
        (nombre_usuario, rol, ip_usuario, hora_acceso, detalle_actividad) 
        VALUES (?, ?, ?, NOW(), ?)
    `;


    await executeQuery(query, [nombre_usuario, rol, ip_usuario, detalle_actividad
    ], 'PAGARES');
}



module.exports = {
    authenticate,


    registrarAuditoria,


};
