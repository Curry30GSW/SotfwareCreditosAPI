require('dotenv').config();
const odbc = require('odbc');

// Configuración de conexiones ODBC
const connectionStringAS400 = `DSN=${process.env.ODBC_DSN};UID=${process.env.ODBC_USER};PWD=${process.env.ODBC_PASSWORD};CCSID=1208`;
const connectionStringPagares = `DSN=${process.env.ODBC_DSN_PAGARE};UID=${process.env.ODBC_USERPAGARE};PWD=${process.env.ODBC_PASSWORDPAGARE};CCSID=1208`;

let connectionAS400;
let connectionPagares;

// Conectar a AS400
const connectToAS400 = async () => {
    if (!connectionAS400) {
        connectionAS400 = await odbc.connect(connectionStringAS400);
        console.log('✅ Conexión establecida con AS400');
    }
    return connectionAS400;
};

// Conectar a Pagares
const connectToPagares = async () => {
    if (!connectionPagares) {
        connectionPagares = await odbc.connect(connectionStringPagares);
        console.log('✅ Conexión establecida con Pagares');
    }
    return connectionPagares;
};

// Ejecutar consultas en la base de datos específica
const executeQuery = async (query, params = [], db = 'AS400') => {
    try {
        const conn = db === 'AS400' ? await connectToAS400() : await connectToPagares();
        const result = await conn.query(query, params);
        return result;
    } catch (error) {
        console.error(`❌ Error al ejecutar la consulta en ${db}:`, error);
        throw error;
    }
};

module.exports = {
    executeQuery,
    connectToAS400,
    connectToPagares
};
