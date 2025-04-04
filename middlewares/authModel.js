const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db');

const UserModel = {
    async authenticate(email, password) {
        try {
            // Consulta con parámetros
            const query = `SELECT email, name, password, rol, agenciau
               FROM users 
               WHERE LOWER(TRIM(email)) = LOWER(TRIM(?) )
               AND email not in ('chutata18@gmail.com')`;
            const users = await executeQuery(query, [email], 'PAGARES');

            if (users.length === 0) {
                return null;
            }

            const user = users[0];

            const isMatch = await bcrypt.compare(password, user.password);


            return isMatch ? user : null;
        } catch (error) {
            console.error("❌ Error en la autenticación:", error);
            throw error;
        }
    }
};

module.exports = UserModel;
