const { executeQuery } = require('../config/db'); // Ajusta la ruta según tu estructura

const obtenerFiltroFecha = () => {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');

    const primerDia = `${año}-${mes}-01`;  // Siempre el primer día del mes
    const ultimoDia = `${año}-${mes}-${dia}`;  // El día actual

    return { primerDia, ultimoDia };
};

const obtenerCreditosPagares = async () => {
    try {
        const { primerDia, ultimoDia } = obtenerFiltroFecha();
        const query = `
            SELECT 
                ID, NoAgencia, CuentaCoop, Cedula_Persona, NombreCompleto, 
                FechaCredito, NoLC, ID_Pagare, Capital, Tasa, 
                Direccion, Linea_Credito, GeneradorPagare, CoorAsignada, 
                Nomina, Aprobado, Ordinario
            FROM menu_datacredito.pagare
            WHERE Fcredito BETWEEN ? AND ?`;

        // Ejecutar consulta con ODBC
        const resultados = await executeQuery(query, [primerDia, ultimoDia], 'PAGARES');
        return resultados;
    } catch (error) {
        console.error('❌ Error al obtener créditos y pagarés:', error);
        throw error;
    }
};

module.exports = { obtenerCreditosPagares };
