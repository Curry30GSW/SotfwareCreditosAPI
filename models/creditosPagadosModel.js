const { executeQuery } = require('../config/db');

const obtenerPagados = async (fechaInicioAS400, fechaFinAS400) => {
    try {
        const queryAS400 = `
            SELECT COUNT(*) AS totalPagados
            FROM COLIB.ACP13
            WHERE SCAP13 >= 0
            AND TCRE13 <> '74'
            AND FECI13 BETWEEN ? AND ?
        `;

        const resultado = await executeQuery(queryAS400, [fechaInicioAS400, fechaFinAS400], 'AS400');
        return resultado[0]?.TOTALPAGADOS || 0;

    } catch (error) {
        console.error('❌ Error en obtenerPagados:', error);
        throw error;
    }
};

const insertarPagados = async (datos) => {
    try {
        const cuenta = String(datos.cuenta || '').trim().toLowerCase();
        const pagare = String(datos.pagare || '').trim().toLowerCase();

        const normalizado = {
            centroCosto: String(datos.centroCosto || '').trim(),
            agencia: String(datos.agencia || '').trim(),
            cuenta,
            cedula: parseInt(datos.cedula || 0),
            nombre: String(datos.nombre || '').trim(),
            score: parseInt(datos.score || 0),
            edad: parseInt(datos.edad || 0),
            analisis: String(datos.analisis || '').trim(),
            fecha_analisis: datos.fecha_analisis || null,
            estado_analisis: parseInt(datos.estado_analisis || 0),
            pagare,
            fecha_credito: datos.fecha_credito || null,
            linea: parseInt(datos.linea || 0),
            recogida: parseInt(datos.recogida || 0),
            capital: parseInt(datos.capital || 0),
            tasa: String(datos.tasa || '').trim(),
            nomina: String(datos.nomina || '').trim(),
            estado: parseInt(datos.estado || 0),
            medio_pago: String(datos.medio_pago || '').trim(),
            usuario_pagador: String(datos.usuario || '').trim(),

        };

        // Verificar si ya existe el crédito
        const verificarEstadoQuery = `
            SELECT estado FROM creditos_pagados
            WHERE LOWER(TRIM(cuenta)) = ? AND LOWER(TRIM(pagare)) = ?
            LIMIT 1
        `;
        const resultado = await executeQuery(verificarEstadoQuery, [cuenta, pagare], 'PAGARES');

        if (resultado.length > 0) {
            const estadoActual = resultado[0].estado;

            if (estadoActual === normalizado.estado) {
                let textoEstado = '';
                if (normalizado.estado === 1) textoEstado = '"Sí"';
                else if (normalizado.estado === 0) textoEstado = '"No"';
                else if (normalizado.estado === 2) textoEstado = '"Tesorería"';

                return { success: false, message: ` El crédito ya tiene estado ${textoEstado}.<strong> No se actualizó. </strong>` };
            }

            // Solo si es diferente, actualizamos
            const updateQuery = `
                UPDATE creditos_pagados
                SET estado = ?, medioPago = ?, usuario_pagador = ?
                WHERE LOWER(TRIM(cuenta)) = ? AND LOWER(TRIM(pagare)) = ?

            `;
            await executeQuery(updateQuery, [normalizado.estado, normalizado.medio_pago, normalizado.usuario_pagador, cuenta, pagare], 'PAGARES');

            return { success: true, message: '🔁 Estado actualizado correctamente.' };
        }

        // Si no existe, insertamos
        const insertQuery = `
            INSERT INTO creditos_pagados (
                centroCosto, agencia, cuenta, cedula, nombre, score, edad, analisis, 
                fecha_analisis, estado_analisis, pagare, fecha_credito, linea, recogida, 
                capital, tasa, nomina, estado, medioPago, usuario_pagador
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            normalizado.centroCosto,
            normalizado.agencia,
            normalizado.cuenta,
            normalizado.cedula,
            normalizado.nombre,
            normalizado.score,
            normalizado.edad,
            normalizado.analisis,
            normalizado.fecha_analisis,
            normalizado.estado_analisis,
            normalizado.pagare,
            normalizado.fecha_credito,
            normalizado.linea,
            normalizado.recogida,
            normalizado.capital,
            normalizado.tasa,
            normalizado.nomina,
            normalizado.estado,
            normalizado.medio_pago,
            normalizado.usuario_pagador
        ];

        await executeQuery(insertQuery, valores, 'PAGARES');

        return { success: true, message: '✅ Registro insertado exitosamente.' };

    } catch (error) {
        console.error('❌ Error en insertarPagados:', error);
        throw error;
    }
};

const obtenerCreditosTesoreria = async () => {
    try {
        const query = `
            SELECT 
              centroCosto,
              agencia,
              cuenta,
              cedula,
              nombre,
              score,
              edad,
              analisis,
              fecha_analisis,
              estado_analisis,
              pagare,
              fecha_credito,
              linea,
              recogida,
              capital,
              tasa,
              nomina,
              estado,
              medioPago,
              fecha_pago,
              usuario_pagador
            FROM creditos_pagados
            WHERE estado = 2
        `;

        const resultado = await executeQuery(query, [], 'PAGARES');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerCreditosTesoreria:', error);
        throw error;
    }
};

module.exports = {
    obtenerPagados,
    insertarPagados,
    obtenerCreditosTesoreria
};


