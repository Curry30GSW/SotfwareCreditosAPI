const { executeQuery } = require('../config/db'); // Ajusta la ruta según tu estructura


const obtenerCreditosPagares = async (fechaInicio, fechaFin) => {
    try {
        const query = `
            SELECT 
                ID, NoAgencia, CuentaCoop, Cedula_Persona, NombreCompleto, 
                FechaCredito, NoLC, ID_Pagare, Capital, Tasa, FechaAccion, 
                Direccion, Linea_Credito, GeneradorPagare, CoorAsignada, 
                Nomina, Aprobado, Ordinario
            FROM menu_datacredito.pagare
            WHERE FechaAccion BETWEEN ? AND ?`;

        // Ejecutar consulta con ODBC
        const resultados = await executeQuery(query, [fechaInicio, fechaFin], 'PAGARES');
        return resultados;
    } catch (error) {
        console.error('❌ Error al obtener créditos y pagarés:', error);
        throw error;
    }
};

module.exports = { obtenerCreditosPagares };
