const { executeQuery } = require('../config/db');

async function obtenerDetallesCero(agen23) {
    try {
        const tableACP03 = `COLIB.ACP03`;
        const tableACP04 = `COLIB.ACP04`;
        const tableACP05 = `COLIB.ACP05`;
        const tableACP23 = `COLIB.ACP23`;

        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();
        const queryDetallesCero = `
            SELECT 
                ${tableACP23}.AGEN23, 
                ${tableACP03}.DESC03, 
                ${tableACP23}.FECH23, 
                ${tableACP23}.NANA23, 
                ${tableACP23}.NCTA23, 
                ${tableACP05}.DESC05, 
                ${tableACP05}.NNIT05, 
                ${tableACP23}.CAPI23, 
                ${tableACP23}.TCRE23, 
                ${tableACP23}.USER23, 
                ${tableACP04}.DESC04
            FROM 
                ${tableACP03}, 
                ${tableACP04}, 
                ${tableACP05}, 
                ${tableACP23}
            WHERE 
                ${tableACP23}.NCTA23 = ${tableACP05}.NCTA05 
                AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                AND ${tableACP23}.AGEN23 = ${tableACP03}.DIST03 
                AND ${tableACP23}.STAT23 = '0'  
                AND ${tableACP23}.FECH23 BETWEEN ? AND ? 
                AND ${tableACP23}.AGEN23 = ?
            ORDER BY 
                ${tableACP03}.DESC03
        `;

        let resultados = await executeQuery(queryDetallesCero, [fechaInicio, fechaFin, agen23], 'AS400');


        const queryScores = `SELECT cedula, Score FROM persona`;
        let scores = await executeQuery(queryScores, [], 'Pagares');


        let scoresMap = {};
        scores.forEach(persona => {
            scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
        });


        resultados = resultados.map(registro => ({
            ...registro,
            Score: scoresMap[String(parseInt(registro.NNIT05, 10))] || "F/D"
        }));

        return resultados;
    } catch (error) {
        console.error("Error en obtenerDetallesCero:", error);
        throw error;
    }
}

async function obtenerDetallesUno(agen23) {
    try {
        const tableACP03 = `COLIB.ACP03`;
        const tableACP04 = `COLIB.ACP04`;
        const tableACP05 = `COLIB.ACP05`;
        const tableACP23 = `COLIB.ACP23`;

        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();

        const queryDetallesUno = `
            SELECT 
                ${tableACP23}.AGEN23, 
                ${tableACP03}.DESC03, 
                ${tableACP23}.FECH23, 
                ${tableACP23}.NANA23, 
                ${tableACP23}.NCTA23, 
                ${tableACP05}.DESC05, 
                ${tableACP05}.NNIT05, 
                ${tableACP23}.CAPI23, 
                ${tableACP23}.TCRE23, 
                ${tableACP23}.USER23, 
                ${tableACP04}.DESC04
            FROM 
                ${tableACP03}, 
                ${tableACP04}, 
                ${tableACP05}, 
                ${tableACP23}
            WHERE 
                ${tableACP23}.NCTA23 = ${tableACP05}.NCTA05 
                AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                AND ${tableACP23}.AGEN23 = ${tableACP03}.DIST03 
                AND ${tableACP23}.STAT23 = '1'  
                AND ${tableACP23}.FECH23 BETWEEN ? AND ? 
                AND ${tableACP23}.AGEN23 = ?
        `;

        let resultados = await executeQuery(queryDetallesUno, [fechaInicio, fechaFin, agen23], 'AS400');

        const queryScores = `SELECT cedula, Score FROM persona`;
        let scores = await executeQuery(queryScores, [], 'Pagares');

        let scoresMap = {};
        scores.forEach(persona => {
            scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
        });

        resultados = resultados.map(registro => ({
            ...registro,
            Score: scoresMap[String(parseInt(registro.NNIT05, 10))] || "F/D"
        }));

        return resultados;
    } catch (error) {
        console.error("Error en obtenerDetallesUno:", error);
        throw error;
    }
}

async function obtenerDetallesDos(agen23) {
    try {
        const tableACP03 = `COLIB.ACP03`;
        const tableACP04 = `COLIB.ACP04`;
        const tableACP05 = `COLIB.ACP05`;
        const tableACP23 = `COLIB.ACP23`;

        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();

        const queryDetallesDos = `
            SELECT 
                ${tableACP23}.AGEN23, 
                ${tableACP03}.DESC03, 
                ${tableACP23}.FECH23, 
                ${tableACP23}.NANA23, 
                ${tableACP23}.NCTA23, 
                ${tableACP05}.DESC05, 
                ${tableACP05}.NNIT05, 
                ${tableACP23}.CAPI23, 
                ${tableACP23}.TCRE23, 
                ${tableACP23}.USER23, 
                ${tableACP04}.DESC04
            FROM 
                ${tableACP03}, 
                ${tableACP04}, 
                ${tableACP05}, 
                ${tableACP23}
            WHERE 
                ${tableACP23}.NCTA23 = ${tableACP05}.NCTA05 
                AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                AND ${tableACP23}.AGEN23 = ${tableACP03}.DIST03 
                AND ${tableACP23}.STAT23 = '2'  
                AND ${tableACP23}.FECH23 BETWEEN ? AND ? 
                AND ${tableACP23}.AGEN23 = ?
        `;

        let resultados = await executeQuery(queryDetallesDos, [fechaInicio, fechaFin, agen23], 'AS400');

        const queryScores = `SELECT cedula, Score FROM persona`;
        let scores = await executeQuery(queryScores, [], 'Pagares');

        let scoresMap = {};
        scores.forEach(persona => {
            scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
        });

        resultados = resultados.map(registro => ({
            ...registro,
            Score: scoresMap[String(parseInt(registro.NNIT05, 10))] || "F/D"
        }));

        return resultados;
    } catch (error) {
        console.error("Error en obtenerDetallesDos:", error);
        throw error;
    }
}

async function obtenerDetallesTres(agen23) {
    try {
        const tableACP03 = `COLIB.ACP03`;
        const tableACP04 = `COLIB.ACP04`;
        const tableACP05 = `COLIB.ACP05`;
        const tableACP23 = `COLIB.ACP23`;

        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();

        const queryDetallesTres = `
            SELECT 
                ${tableACP23}.AGEN23, 
                ${tableACP03}.DESC03, 
                ${tableACP23}.FECH23, 
                ${tableACP23}.NANA23, 
                ${tableACP23}.NCTA23, 
                ${tableACP05}.DESC05, 
                ${tableACP05}.NNIT05, 
                ${tableACP23}.CAPI23, 
                ${tableACP23}.TCRE23, 
                ${tableACP23}.USER23, 
                ${tableACP04}.DESC04
            FROM 
                ${tableACP03}, 
                ${tableACP04}, 
                ${tableACP05}, 
                ${tableACP23}
            WHERE 
                ${tableACP23}.NCTA23 = ${tableACP05}.NCTA05 
                AND ${tableACP05}.NOMI05 = ${tableACP04}.NOMI04 
                AND ${tableACP23}.AGEN23 = ${tableACP03}.DIST03 
                AND ${tableACP23}.STAT23 = '3'  
                AND ${tableACP23}.FECH23 BETWEEN ? AND ? 
                AND ${tableACP23}.AGEN23 = ?
        `;

        let resultados = await executeQuery(queryDetallesTres, [fechaInicio, fechaFin, agen23], 'AS400');

        const queryScores = `SELECT cedula, Score FROM persona`;
        let scores = await executeQuery(queryScores, [], 'Pagares');

        let scoresMap = {};
        scores.forEach(persona => {
            scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
        });

        resultados = resultados.map(registro => ({
            ...registro,
            Score: scoresMap[String(parseInt(registro.NNIT05, 10))] || "F/D"
        }));

        return resultados;
    } catch (error) {
        console.error("Error en obtenerDetallesTres:", error);
        throw error;
    }
}

function obtenerRangoFechasActual() {
    const hoy = new Date();
    const añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`;
    const mesStr = String(hoy.getMonth() + 1).padStart(2, '0');
    const diaStr = String(hoy.getDate()).padStart(2, '0');

    const fechaInicio = `1250401`;
    const fechaFin = `${añoAs400}${mesStr}${diaStr}`;

    return [fechaInicio, fechaFin];
}

module.exports = {
    obtenerDetallesCero,
    obtenerDetallesUno,
    obtenerDetallesDos,
    obtenerDetallesTres
};
