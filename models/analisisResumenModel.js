const { executeQuery } = require('../config/db');

function obtenerUltimosSeisMeses() {
    const hoy = new Date();
    let meses = [];

    for (let i = 1; i <= 7; i++) {
        let fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        let fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() - i + 1, 0);

        let añoAs400 = `1${(fechaInicio.getFullYear() - 1900).toString().slice(-2)}`;
        let mes = String(fechaInicio.getMonth() + 1).padStart(2, '0');
        let inicio = `${añoAs400}${mes}01`;
        let fin = `${añoAs400}${mes}${String(fechaFin.getDate()).padStart(2, '0')}`;

        meses.push(inicio, fin);
    }
    return meses;
}

const obtenerAnalisisPorEstado = async (mesInt, estado) => {
    try {
        const fechas = obtenerUltimosSeisMeses();
        const fechaInicio = fechas[mesInt * 2];
        const fechaFin = fechas[mesInt * 2 + 1];

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
        return await executeQuery(query, [fechaInicio, fechaFin, estado]);
    } catch (error) {
        console.error(`Error en obtenerAnalisisPorEstado (${estado}):`, error);
        throw error;
    }
};

const obtenerDatosPorAgenciaYFechas = async (agencia, mesInt, estado) => {
    try {
        const fechas = obtenerUltimosSeisMeses();
        const fechaInicio = fechas[mesInt * 2];
        const fechaFin = fechas[mesInt * 2 + 1];

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
            AND ACP23.STAT23 = ?  
            AND ACP23.FECH23 BETWEEN ? AND ? 
            AND ACP23.AGEN23 = ?
        ORDER BY 
            ACP03.DESC03
        `;

        return await executeQuery(query, [estado, fechaInicio, fechaFin, agencia]);
    } catch (error) {
        console.error(`Error en obtenerDatosPorAgenciaYFechas (${agencia}):`, error);
        throw error;
    }
};


console.log(obtenerUltimosSeisMeses());

module.exports = { obtenerAnalisisPorEstado, obtenerDatosPorAgenciaYFechas };