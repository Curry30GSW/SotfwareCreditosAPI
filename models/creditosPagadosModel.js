// const { executeQuery } = require('../config/db');

// const obtenerPagados = async () => {
//     try {
//         const hoy = new Date();
//         const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
//         const primerDiaAS400 = `1${(primerDia.getFullYear() - 1900).toString().slice(-2)}${String(primerDia.getMonth() + 1).padStart(2, '0')}01`;
//         const hoyAS400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

//         // 🔹 Consulta en AS400 con fechas dinámicas
//         const queryAS400 = `
//             SELECT NCTA13, NCRE13
//             FROM COLIB.ACP13
//             WHERE SCAP13 >= 0
//             AND TCRE13 <> '74'
//             AND FECI13 BETWEEN ? AND ?
//         `;
//         const pagaresAS400 = await executeQuery(queryAS400, [primerDiaAS400, hoyAS400]);
//         console.log("Pagados AS400:", pagaresAS400);

//         const queryMySQL = `
//             SELECT CuentaCoop, ID_Pagare
//             FROM pagare
//             WHERE (${Array(6).fill("FechaAccion LIKE ?").join(" OR ")})
//             AND Aprobado = '1'
//         `;

//         const meses = [];

//         // Generar los últimos 6 meses con sus respectivos años
//         for (let i = 0; i < 6; i++) {
//             const fecha = new Date(hoy);
//             fecha.setMonth(hoy.getMonth() - i);

//             const mesNombre = fecha.toLocaleString('es-CO', { month: 'long' });
//             const anio = fecha.getFullYear();

//             if (mesNombre) {  // Asegurar que no sea null
//                 meses.push(`${mesNombre} % ${anio}`);
//             }
//         }

//         // Filtrar valores nulos antes de ejecutar la consulta
//         const mesesValidos = meses.filter(m => m);

//         const pagaresPagares = await executeQuery(queryMySQL, mesesValidos, 'PAGARES');





//         const pagaresAS400Set = new Set(
//             pagaresAS400.map(p => `${String(p.NCTA13).trim()}-${String(p.NCRE13).trim()}`)
//         );
//         console.log("Total en AS400:", pagaresAS400.length);
//         console.log("Total en MySQL:", pagaresPagares.length);
//         console.log("Valores únicos en AS400:", new Set(pagaresAS400.map(p => String(p.NCRE13))).size);
//         console.log("Valores únicos en MySQL:", new Set(pagaresPagares.map(p => p.ID_Pagare)).size);
//         const pagados = pagaresPagares.filter(p => {
//             const clave = `${String(p.CuentaCoop).trim()}-${String(p.ID_Pagare).trim()}`;
//             return pagaresAS400Set.has(clave);
//         }).length;





//         return pagados;

//     } catch (error) {
//         console.error('❌ Error en obtenerPagados:', error);
//         throw error;
//     }
// };

// module.exports = { obtenerPagados };

const { executeQuery } = require('../config/db');

const obtenerPagados = async () => {
    try {
        const hoy = new Date();
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const primerDiaAS400 = `1${(primerDia.getFullYear() - 1900).toString().slice(-2)}${String(primerDia.getMonth() + 1).padStart(2, '0')}01`;
        const hoyAS400 = `1${(hoy.getFullYear() - 1900).toString().slice(-2)}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

        const queryAS400 = `
        SELECT COUNT(*) AS totalPagados
        FROM COLIB.ACP13
        WHERE SCAP13 >= 0
        AND TCRE13 <> '74'
        AND FECI13 BETWEEN ? AND ?
    `;

        const resultado = await executeQuery(queryAS400, [primerDiaAS400, hoyAS400]);

        const totalPagados = resultado[0]?.TOTALPAGADOS || 0;



        return totalPagados;

    } catch (error) {
        console.error('❌ Error en obtenerPagados:', error);
        throw error;
    }
};

module.exports = { obtenerPagados };
