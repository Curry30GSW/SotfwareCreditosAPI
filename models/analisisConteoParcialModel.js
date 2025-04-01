const { executeQuery } = require('../config/db');

function obtenerRangoFechas() {
    const hoy = new Date();

    // Fecha fin ahora es la fecha actual
    let fechaFin = hoy;

    // Primer día del mes de hace 6 meses (para completar 7 meses en total)
    let fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 6, 1);

    let añoAs400Inicio = `1${(fechaInicio.getFullYear() - 1900).toString().slice(-2)}`;
    let mesInicio = String(fechaInicio.getMonth() + 1).padStart(2, "0");
    let inicio = parseInt(`${añoAs400Inicio}${mesInicio}01`, 10);

    let añoAs400Fin = `1${(fechaFin.getFullYear() - 1900).toString().slice(-2)}`;
    let mesFin = String(fechaFin.getMonth() + 1).padStart(2, "0");
    let fin = parseInt(`${añoAs400Fin}${mesFin}${String(fechaFin.getDate()).padStart(2, "0")}`, 10);

    return [inicio, fin];
}


const obtenerDetalleAgenciaConFechasDinamicas = async (agencia) => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechas();

        const query = `
        SELECT 
            ACP23.AGEN23, 
            ACP03.DESC03, 
            ACP23.FECH23, 
            ACP23.NANA23, 
            ACP23.NCTA23, 
            ACP05.DESC05, 
            ACP05.NNIT05, 
            ACP23.CAPI23, 
            ACP23.TCRE23, 
            ACP23.USER23,
            ACP23.STAT23, 
            ACP04.DESC04
        FROM 
            COLIB.ACP03 ACP03, 
            COLIB.ACP04 ACP04, 
            COLIB.ACP05 ACP05, 
            COLIB.ACP23 ACP23
        WHERE 
            ACP23.NCTA23 = ACP05.NCTA05 
            AND ACP05.NOMI05 = ACP04.NOMI04 
            AND ACP23.AGEN23 = ACP03.DIST03 
            AND ACP23.STAT23 IN ('0','1','2','3')
            AND ACP23.FECH23 BETWEEN ? AND ? 
            AND ACP23.AGEN23 = ?
        ORDER BY 
            ACP03.DESC03
        `;

        return await executeQuery(query, [fechaInicio, fechaFin, agencia]);

    } catch (error) {
        console.error(`Error en obtenerDatosPorAgenciaYFechas (${agencia}):`, error);
        throw error;
    }
};

const obtenerDetalleAnalisisEstadoCero = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechas();

        const query = `
        SELECT 
            ACP23.AGEN23, 
            ACP03.DESC03, 
            ACP23.FECH23, 
            ACP23.NANA23, 
            ACP23.NCTA23, 
            ACP05.DESC05, 
            ACP05.NNIT05, 
            ACP23.CAPI23, 
            ACP23.TCRE23, 
            ACP23.USER23,
            ACP23.STAT23, 
            ACP04.DESC04
        FROM 
            COLIB.ACP03 ACP03, 
            COLIB.ACP04 ACP04, 
            COLIB.ACP05 ACP05, 
            COLIB.ACP23 ACP23
        WHERE 
            ACP23.NCTA23 = ACP05.NCTA05 
            AND ACP05.NOMI05 = ACP04.NOMI04 
            AND ACP23.AGEN23 = ACP03.DIST03 
            AND ACP23.STAT23 = '0'
            AND ACP23.FECH23 BETWEEN ? AND ? 
            AND ACP23.AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                               '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                               '93','94','95','96','97','98')
        ORDER BY 
            ACP03.DESC03
        `;

        return await executeQuery(query, [fechaInicio, fechaFin]);

    } catch (error) {
        console.error(`Error en obtenerDatosPorAgenciaYFechas:`, error);
        throw error;
    }
};

const obtenerDetalleAnalisisEstadoUno = async () => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechas();

        const query = `
        SELECT 
            ACP23.AGEN23, 
            ACP03.DESC03, 
            ACP23.FECH23, 
            ACP23.NANA23, 
            ACP23.NCTA23, 
            ACP05.DESC05, 
            ACP05.NNIT05, 
            ACP26.NCRE26, 
            ACP26.FECH26, 
            ACP23.CAPI23, 
            ACP23.TCRE23, 
            ACP23.USER23,
            ACP23.STAT23, 
            ACP04.DESC04
        FROM 
            COLIB.ACP03 ACP03, 
            COLIB.ACP04 ACP04, 
            COLIB.ACP05 ACP05, 
            COLIB.ACP23 ACP23,
            COLIB.ACP26 ACP26
        WHERE 
            ACP23.NCTA23 = ACP05.NCTA05 
            AND ACP05.NOMI05 = ACP04.NOMI04 
            AND ACP23.AGEN23 = ACP03.DIST03 
            AND ACP23.NANA23 = ACP26.NANA26 
            AND ACP23.NCTA23 = ACP26.NCTA26 
            AND ACP23.STAT23 = '1'
            AND ACP23.FECH23 BETWEEN ? AND ? 
            AND ACP23.AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                               '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                               '93','94','95','96','97','98')
        ORDER BY 
            ACP23.AGEN23
        `;

        return await executeQuery(query, [fechaInicio, fechaFin]);

    } catch (error) {
        console.error(`Error en obtenerDatosPorAgenciaYFechas:`, error);
        throw error;
    }
};


const obtenerAnalisisPorEstadoConFechasDinamicas = async (estado, agencia) => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechas();

        const query = `
        SELECT ACP23.AGEN23, ACP03.DESC03, COUNT(ACP23.NANA23) AS ANALISIS
        FROM COLIB.ACP23 ACP23
        JOIN COLIB.ACP03 ACP03 ON ACP23.AGEN23 = ACP03.DIST03
        WHERE ACP23.FECH23 BETWEEN ? AND ?
        AND ACP23.STAT23 = ?
        AND ACP23.AGEN23 = ?
        GROUP BY ACP23.AGEN23, ACP03.DESC03
        ORDER BY ACP23.AGEN23
        `;

        // Ahora pasamos todos los parámetros en el orden correcto
        const resultado = await executeQuery(query, [fechaInicio, fechaFin, estado, agencia]);
        return resultado;
    } catch (error) {
        console.error("Error en obtenerAnalisisPorEstadoConFechasDinamicas:", error);
        throw error;
    }
};

const obtenerAnalisisTotaltes = async (estado) => {
    try {
        const [fechaInicio, fechaFin] = obtenerRangoFechas();

        const query = `
        SELECT ACP23.AGEN23, ACP03.DESC03, COUNT(ACP23.NANA23) AS ANALISIS
        FROM COLIB.ACP23 ACP23
        JOIN COLIB.ACP03 ACP03 ON ACP23.AGEN23 = ACP03.DIST03
        WHERE ACP23.FECH23 BETWEEN ? AND ?
        AND ACP23.STAT23 = ?
        AND ACP23.AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                               '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                               '93','94','95','96','97','98')
        GROUP BY ACP23.AGEN23, ACP03.DESC03
        ORDER BY ACP23.AGEN23
        `;

        // Ahora pasamos todos los parámetros en el orden correcto
        const resultado = await executeQuery(query, [fechaInicio, fechaFin, estado]);
        return resultado;
    } catch (error) {
        console.error("Error en obtenerAnalisisPorEstadoConFechasDinamicas:", error);
        throw error;
    }
};


module.exports = { obtenerDetalleAgenciaConFechasDinamicas, obtenerAnalisisPorEstadoConFechasDinamicas, obtenerAnalisisTotaltes, obtenerDetalleAnalisisEstadoCero, obtenerDetalleAnalisisEstadoUno };