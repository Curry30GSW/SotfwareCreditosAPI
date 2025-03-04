const { executeQuery } = require('../config/db');

function obtenerRangoFechasActual() {
    const hoy = new Date();
    const añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`;
    const mesStr = String(hoy.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque getMonth() es base 0
    const diaStr = String(hoy.getDate()).padStart(2, '0');

    const fechaInicio = `1241101`; // Fecha fija
    const fechaFin = `${añoAs400}${mesStr}${diaStr}`;

    return [fechaInicio, fechaFin];
}


//Funcion para que aparezca san ANDRES porque no hace analisis desde noviembre 
function obtenerRangoFechasMesAnterior() {
    const hoy = new Date();
    let añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`;
    let mesAnterior = hoy.getMonth();

    if (mesAnterior === 0) {
        mesAnterior = 12;
        añoAs400 = `1${(hoy.getFullYear() - 1901).toString().slice(-2)}`;
    }

    let mesStr = String(mesAnterior).padStart(2, '0');
    let fechaInicio = `1241101`; // Fecha fija
    let fechaFin = `${añoAs400}${mesStr}31`;

    return [fechaInicio, fechaFin];
}

const analisisModel = {
    async getAnalisis() {
        try {
            const [fechaInicio, fechaFin] = obtenerRangoFechasActual();

            const queryAnalisis = `
                SELECT 
                    TRIM(ACP03.DESC03) AGENCIA, ACP23.FECH23 FECHA, ACP23.NANA23 ANAL, ACP23.AGEN23 AGEANA, 
                    ACP23.CAPI23 COLOCADO, ACP23.USER23 USUARIO, ACP23.STAT23 ESTADO, ACP05.NNIT05 CEDULA
                FROM 
                    COLIB.ACP03 ACP03, COLIB.ACP04 ACP04, COLIB.ACP05 ACP05, COLIB.ACP23 ACP23, COLIB.ACP26 ACP26
                WHERE 
                    ACP05.DIST05 = ACP03.DIST03 
                    AND ACP23.NCTA23 = ACP05.NCTA05 
                    AND ACP05.NOMI05 = ACP04.NOMI04 
                    AND ACP23.NCTA23 = ACP26.NCTA26 
                    AND ACP23.NANA23 = ACP26.NANA26
                    AND (ACP23.FECH23 BETWEEN ? AND ?) 
                    AND (ACP23.TCRE23 IN ('99','93','90','89','86','85','84','83','82','80','77','76','70','65','64','63',
                                          '62','61','40','39','34','32','16','20','33','78','81','88','79','18','87','94'))
                ORDER BY ACP23.FECH23
            `;

            let resultAnalisis = await executeQuery(queryAnalisis, [fechaInicio, fechaFin]);

            // ✅ Consultar los Scores en la base de datos Pagares (menu_datacredito)
            const queryScores = `SELECT cedula, Score FROM persona`;
            let scores = await executeQuery(queryScores, [], 'Pagares'); // 🔹 Usa la conexión de Pagares

            // Convertir los resultados de MySQL en un objeto para acceso rápido
            let scoresMap = {};
            scores.forEach(persona => {
                scoresMap[String(parseInt(persona.cedula, 10))] = persona.Score;
            });

            // Agregar el Score al resultado del análisis
            resultAnalisis = resultAnalisis.map(analisis => ({
                ...analisis,
                Score: scoresMap[String(parseInt(analisis.CEDULA, 10))] || 'NO TIENE CONSULTA REALIZADA'
            }));

            return { analisis: resultAnalisis };
        } catch (error) {
            console.error('Error al obtener análisis:', error);
            throw error;
        }
    }
    ,

    async getUltimoConsecutivo() {
        try {
            const [fechaInicioMesAnterior, fechaFinMesAnterior] = obtenerRangoFechasMesAnterior();

            const queryUltimoConsecutivo = `
                SELECT AGEN23, MAX(NANA23) AS ULTIMO_CONSECUTIVO
                FROM COLIB.ACP23
                WHERE FECH23 BETWEEN ? AND ?
                AND STAT23 IN ('0','1','2','3')
                AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                                '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                                '93','94','95','96','97','98')
                GROUP BY AGEN23
                ORDER BY AGEN23
            `;

            const resultUltimoConsecutivo = await executeQuery(queryUltimoConsecutivo, [fechaInicioMesAnterior, fechaFinMesAnterior]);

            return { ultimoConsecutivo: resultUltimoConsecutivo };
        } catch (error) {
            console.error('Error al obtener el último consecutivo:', error);
            throw error;
        }
    },

    async getUltimoConsecutivoMesActual() {
        try {
            const [fechaInicio, fechaFin] = obtenerRangoFechasActual();

            const queryUltimoConsecutivo = `
                SELECT AGEN23, MAX(NANA23) AS ULTIMO_CONSECUTIVO
                FROM COLIB.ACP23
                WHERE FECH23 BETWEEN ? AND ?
                AND STAT23 IN ('0','1','2','3')
                AND AGEN23 IN ('13','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48',
                                '68','70','73','74','76','77','78','80','81','82','83','84','85','86','87','88','89','90','91','92',
                                '93','94','95','96','97','98')
                GROUP BY AGEN23
                ORDER BY AGEN23
            `;

            const resultUltimoConsecutivo = await executeQuery(queryUltimoConsecutivo, [fechaInicio, fechaFin]);

            // Renombrar la clave "ULTIMO_CONSECUTIVO" a "ULTIMO_CONSECUTIVONOW"
            const dataTransformada = resultUltimoConsecutivo.map(item => ({
                AGEN23: item.AGEN23,
                ULTIMO_CONSECUTIVONOW: item.ULTIMO_CONSECUTIVO
            }));

            return { ultimoConsecutivo: dataTransformada };
        } catch (error) {
            console.error('Error al obtener el último consecutivo:', error);
            throw error;
        }
    }

};

module.exports = analisisModel;

//FUNCION MÁS ACTUALIZADA SIN SAI

// function obtenerRangoFechasActual() {
//     const hoy = new Date();
//     const añoAs400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}`;
//     const mesStr = String(hoy.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque getMonth() es base 0
//     const diaStr = String(hoy.getDate()).padStart(2, '0');

//     const fechaInicio = `${añoAs400}${mesStr}01`;
//     const fechaFin = `${añoAs400}${mesStr}${diaStr}`;

//     return [fechaInicio, fechaFin];
// }

//Funcion más actualizada sin SAI

// function obtenerRangoFechasMesAnterior() {
//     const hoy = new Date();
//     let añoAs400 = 1${(hoy.getFullYear() - 1900).toString().slice(-2)};
//     let mesAnterior = hoy.getMonth();

//     if (mesAnterior === 0) {
//         mesAnterior = 12;
//         añoAs400 = 1${(hoy.getFullYear() - 1901).toString().slice(-2)};
//     }

//     let mesStr = String(mesAnterior).padStart(2, '0');
//     let fechaInicio = ${añoAs400}${mesStr}01;
//     let fechaFin = ${añoAs400}${mesStr}31;

//     return [fechaInicio, fechaFin];
// }