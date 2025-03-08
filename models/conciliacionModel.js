const { executeQuery } = require('../config/db');

// Función para obtener el primer y último día del mes actual
const obtenerFiltroFecha = () => {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');

    const primerDia = `${año}-${mes}-01`;  // Siempre el primer día del mes
    const ultimoDia = `${año}-${mes}-${dia}`;  // El día actual

    return { primerDia, ultimoDia };
};

const obtenerCreditosPagares = async (fechaInicio, fechaFin) => {
    try {
        const { primerDia, ultimoDia } = obtenerFiltroFecha();
        const fechaInicioFiltro = fechaInicio || primerDia;
        const fechaFinFiltro = fechaFin || ultimoDia;

        // OBTENER EL PRIMER ID DEL PERIODO SELECCIONADO
        const queryMin = `
            SELECT ID 
            FROM pagare 
            WHERE Fcredito BETWEEN ? AND ? 
            ORDER BY ID ASC 
            LIMIT 1
        `;
        const resultadoMin = await executeQuery(queryMin, [fechaInicioFiltro, fechaFinFiltro], 'PAGARES');

        // OBTENER EL ÚLTIMO ID DEL PERIODO SELECCIONADO
        const queryMax = `
            SELECT ID 
            FROM pagare 
            WHERE Fcredito BETWEEN ? AND ? 
            ORDER BY ID DESC 
            LIMIT 1
        `;
        const resultadoMax = await executeQuery(queryMax, [fechaInicioFiltro, fechaFinFiltro], 'PAGARES');

        // OBTENER CANTIDAD DE ANULADOS
        const queryAnulados = `
            SELECT COUNT(*) AS total_anulados  
            FROM pagare 
            WHERE Fcredito BETWEEN ? AND ? 
            AND Aprobado = '4'
        `;
        const resultadoAnulados = await executeQuery(queryAnulados, [fechaInicioFiltro, fechaFinFiltro], 'PAGARES');

        // OBTENER CANTIDAD DE RECHAZADOS
        const queryRechazados = `
            SELECT COUNT(*) AS total_rechazado 
            FROM pagare 
            WHERE Fcredito BETWEEN ? AND ? 
            AND Aprobado = '0'
        `;
        const resultadoRechazados = await executeQuery(queryRechazados, [fechaInicioFiltro, fechaFinFiltro], 'PAGARES');

        // OBTENER CANTIDAD DE APROBADOS
        const queryAprobados = `
            SELECT COUNT(*) AS total_aprobados 
            FROM pagare 
            WHERE Fcredito BETWEEN ? AND ? 
            AND Aprobado = '1'
        `;
        const resultadoAprobados = await executeQuery(queryAprobados, [fechaInicioFiltro, fechaFinFiltro], 'PAGARES');



        // EXTRAER LOS VALORES O USAR NULL SI NO HAY REGISTROS
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

module.exports = { obtenerCreditosPagares, obtenerFiltroFecha };

