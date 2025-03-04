const { executeQuery } = require('../config/db');

function obtenerRangoFechasActual() {
    const hoy = new Date();

    // Obtener el primer día del mes en formato AS400 (1AAMMDD)
    let añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`; // Ej: 2024 → 124
    let mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes actual

    let fechaInicio = `${añoAs400}${mes}01`; // Primer día del mes
    let fechaFin = `${añoAs400}${mes}${String(hoy.getDate()).padStart(2, '0')}`; // Fecha actual

    return [fechaInicio, fechaFin];
}

module.exports = { obtenerRangoFechasActual };


const obtenerAnalisisCero = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();
        const query = `
            SELECT AGEN23, COUNT(NANA23) AS ANALISIS_CERO
            FROM COLIB.ACP23
            WHERE FECH23 BETWEEN ? AND ?
            AND STAT23 = '0'
            AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                           '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                           '93','94','95','96','97','98')
            GROUP BY AGEN23
            ORDER BY AGEN23
        `;
        return await executeQuery(query, [fechaInicio, fechaFin]);
    } catch (error) {
        console.error('Error en obtenerAnalisisCero:', error);
        throw error;
    }
};

const obtenerAnalisisUno = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();
        const query = `
            SELECT AGEN23, COUNT(NANA23) AS ANALISIS_UNO
            FROM COLIB.ACP23
            WHERE FECH23 BETWEEN ? AND ?
            AND STAT23 = '1'
            AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                           '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                           '93','94','95','96','97','98')
            GROUP BY AGEN23
            ORDER BY AGEN23
        `;
        return await executeQuery(query, [fechaInicio, fechaFin]);
    } catch (error) {
        console.error('Error en obtenerAnalisisUno:', error);
        throw error;
    }
};

const obtenerAnalisisDos = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();
        const query = `
            SELECT AGEN23, COUNT(NANA23) AS ANALISIS_DOS
            FROM COLIB.ACP23
            WHERE FECH23 BETWEEN ? AND ?
            AND STAT23 = '2'
            AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                           '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                           '93','94','95','96','97','98')
            GROUP BY AGEN23
            ORDER BY AGEN23
        `;
        return await executeQuery(query, [fechaInicio, fechaFin]);
    } catch (error) {
        console.error('Error en obtenerAnalisisDos:', error);
        throw error;
    }
};

const obtenerAnalisisTres = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechasActual();
        const query = `
            SELECT AGEN23, COUNT(NANA23) AS ANALISIS_TRES
            FROM COLIB.ACP23
            WHERE FECH23 BETWEEN ? AND ?
            AND STAT23 = '3'
            AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                           '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                           '93','94','95','96','97','98')
            GROUP BY AGEN23
            ORDER BY AGEN23
        `;
        return await executeQuery(query, [fechaInicio, fechaFin]);
    } catch (error) {
        console.error('Error en obtenerAnalisisTres:', error);
        throw error;
    }
};

module.exports = { obtenerAnalisisCero, obtenerAnalisisUno, obtenerAnalisisDos, obtenerAnalisisTres };
