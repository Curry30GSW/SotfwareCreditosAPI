const { executeQuery } = require('../config/db');

// Función para obtener el mes en español y el año actual
const obtenerFiltroFecha = () => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const fechaActual = new Date();
    const mes = meses[fechaActual.getMonth()]; // Obtener mes en español
    const año = fechaActual.getFullYear(); // Obtener el año actual

    return `${mes} % ${año}`;
};

const obtenerCreditosPagares = async () => {
    try {
        const filtroFecha = obtenerFiltroFecha();

        // 🔹 OBTENER EL PRIMER ID DEL MES
        const queryMin = `
            SELECT ID 
            FROM pagare 
            WHERE FechaAccion LIKE ? 
            ORDER BY ID ASC 
            LIMIT 1
        `;
        const resultadoMin = await executeQuery(queryMin, [filtroFecha], 'PAGARES');

        // 🔹 OBTENER EL ÚLTIMO ID DEL MES
        const queryMax = `
            SELECT ID 
            FROM pagare 
            WHERE FechaAccion LIKE ? 
            ORDER BY ID DESC 
            LIMIT 1
        `;
        const resultadoMax = await executeQuery(queryMax, [filtroFecha], 'PAGARES');

        // 🔹 OBTENER CANTIDAD DE ANULADOS
        const queryAnulados = `
            SELECT COUNT(*) AS total_anulados  
            FROM pagare 
            WHERE FechaAccion LIKE ? 
            AND Aprobado = '4'
        `;
        const resultadoAnulados = await executeQuery(queryAnulados, [filtroFecha], 'PAGARES');

        // 🔹 OBTENER CANTIDAD DE RECHAZADOS
        const queryRechazados = `
            SELECT COUNT(*) AS total_rechazado 
            FROM pagare 
            WHERE FechaAccion LIKE ? 
            AND Aprobado = '0'
        `;
        const resultadoRechazados = await executeQuery(queryRechazados, [filtroFecha], 'PAGARES');

        // 🔹 OBTENER CANTIDAD DE APROBADOS
        const queryAprobados = `
            SELECT COUNT(*) AS total_aprobados 
            FROM pagare 
            WHERE FechaAccion LIKE ? 
            AND Aprobado = '1'
        `;
        const resultadoAprobados = await executeQuery(queryAprobados, [filtroFecha], 'PAGARES');

        // 🔹 EXTRAER LOS VALORES O USAR NULL SI NO HAY REGISTROS
        const primerID = resultadoMin.length > 0 ? resultadoMin[0].ID : null;
        const ultimoID = resultadoMax.length > 0 ? resultadoMax[0].ID : null;
        const anulados = resultadoAnulados.length > 0 ? resultadoAnulados[0].total_anulados : 0;
        const rechazados = resultadoRechazados.length > 0 ? resultadoRechazados[0].total_rechazado : 0;
        const aprobados = resultadoAprobados.length > 0 ? resultadoAprobados[0].total_aprobados : 0;

        return {
            MinimoID: primerID,
            MaximoID: ultimoID,
            Anulados: anulados,
            Rechazados: rechazados,
            Aprobados: aprobados
        };

    } catch (error) {
        console.error('❌ Error al obtener créditos y pagarés:', error);
        throw error;
    }
};

module.exports = { obtenerCreditosPagares };
