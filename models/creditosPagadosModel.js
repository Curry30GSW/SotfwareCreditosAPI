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

        const fecha = getFechaHoyAS400();

        const query = `
            SELECT ACP05.DIST05, ACP03.DESC03, cta.CB_TID, cta.CB_ID, cta.CB_CUENTA, cta.CB_BANCO, BN.BN_DESCR, 
                   cta.CB_CTABCO, cta.CB_TIPO, cta.CB_FECHA, cta.CB_ESTADO, cta.CB_NOMBRE, cta.CB_MAIL, 
                   cta.CB_CIUDAD, ACP16.NCTA16, ACP16.SCAP16, ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16
            FROM COLIB.ACP03 ACP03, 
                 COLIB.ACP05 ACP05, 
                 COLIB.ACP16 ACP16, 
                 COLIB.ACP160 ACP160, 
                 COLIB.BANCOS BN, 
                 COLIB.CTASBAN cta
            WHERE 
                ACP05.DIST05 = ACP03.DIST03 AND 
                ACP16.EMPR16 = '01' AND 
                ACP16.FECH16 = ACP160.FECH16 AND 
                ACP16.FECH16 = ? AND 
                ACP16.HORA16 = ACP160.HORA16 AND 
                ACP16.AGEN16 = ACP160.AGEN16 AND 
                cta.CB_CUENTA = NCTA05 AND 
                cta.CB_CUENTA = ACP16.NCTA16 AND 
                cta.CB_ESTADO = 0 AND 
                ACP16.NDOC16 = '' AND 
                ACP16.SCAP16 > 0 AND 
                cta.CB_BANCO = BN.BN_BANCO AND 
                ACP16.CBCO16 = 'TB' AND 
                ACP160.DET116 = '' AND 
                ACP16.CTRA16 = '5' AND 
                ACP16.NCTA16 NOT IN ('110384') AND 
                ACP16.TTRA16 IN ('DA','DE','RE','PE','PO','PR')
            ORDER BY ACP05.DIST05, cta.CB_CUENTA
        `;

        const resultado = await executeQuery(query, [fecha], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerCreditosTesoreria:', error);
        throw error;
    }
};

const obtenerCreditosTesoreriaTerceros = async () => {
    try {

        const fecha = getFechaHoyAS400();

        const query = `
            SELECT acp16.AGEN16,
                CB_TID, CB_ID, CB_DIGITO, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, ACP16.NCTA16,
                (SCAP13 - SSEG13 - VFOG13 - INTP13 - ESCR13 - CAAP13 - REOR13 - REES13 - RECO13 - REOC13 - ORSU13 + (OTRO13 + SIMO13)) AS VALOR,
                ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16
            FROM 
                COLIB.ACP16 ACP16,
                COLIB.ACP160 ACP160,
                COLIB.CTASPROV cta,
                COLIB.BANCOS BN,
                COLIB.ACP13 ACP13
            WHERE 
                ACP16.EMPR16 = '01' AND
                ACP16.FECH16 = ACP160.FECH16 AND
                ACP16.HORA16 = ACP160.HORA16 AND
                chgi13 > 0 AND
                tcre13 <> '20' AND
                (CB_ID = ACP160.DET116 OR CB_ID = ACP160.DET216) AND
                (CB_CTABCO = ACP160.DET416 OR CB_CTABCO = ACP160.DET316) AND
                ACP16.FECH16 = ? AND
                ACP16.FECH16 = FECI13 AND
                ACP16.NCRE16 = ACP13.NCRE13 AND
                cta.CB_ESTADO = 0 AND
                cta.CB_BANCO = BN.BN_BANCO AND
                ACP16.NCTA16 = NCTA13 AND
                ACP16.CBCO16 = 'TB' AND
                ACP160.DET116 <> '' AND
                ACP16.CTRA16 = '5' AND
                ACP16.TTRA16 IN ('DA', 'DE', 'RE', 'PE', 'PO', 'PR')
        `;

        const resultado = await executeQuery(query, [fecha], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerCreditosTesoreriaTerceros:', error);
        throw error;
    }
};

const pagoApoderados = async () => {
    try {
        const query = `
            SELECT  
                CB_TID, CB_ID, CB_CUENTA, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, ACP16.NCTA16, ACP16.SCAP16 AS VALOR, ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16
            FROM 
                COLIB.ACP16 ACP16,
                COLIB.ACP160 ACP160,
                COLIB.ACP05 ACP05,
                COLIB.CTASBENEF CTA,
                COLIB.BANCOS BN
            WHERE 
                ACP16.EMPR16 = '01' 
                AND ACP16.FECH16 = '1250409'
                AND ACP05.NCTA05 = ACP16.NCTA16
                AND (
                    (ACP05.NNIT05 = CTA.CB_ID) 
                    OR (CB_ID = ACP160.DET116 OR CB_ID = ACP160.DET216 OR CB_ID = ACP160.DET216)
                )
                AND CTA.CB_BANCO = BN.BN_BANCO
                AND ACP16.FECH16 = ACP160.FECH16 
                AND ACP16.HORA16 = ACP160.HORA16 
                AND ACP16.AGEN16 = ACP160.AGEN16
                AND ACP16.CBCO16 = 'TB'
                AND ACP16.CTRA16 = '5'
                AND ACP16.TTRA16 IN ('DA', 'DE', 'RE', 'PE', 'PO', 'PR')
            ORDER BY CB_CUENTA
        `;

        const resultado = await executeQuery(query, [], 'AS400'); // Pasa un array vacío si no necesitas parámetros adicionales.
        return resultado;

    } catch (error) {
        console.error('❌ Error en pagoApoderados:', error);
        throw error;
    }
};




const getFechaHoyAS400 = () => {
    const hoy = new Date();
    const año = hoy.getFullYear().toString().slice(-2); // últimos 2 dígitos del año
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth es base 0
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `1${año}${mes}${dia}`; // ejemplo: 1250409
};

module.exports = {
    obtenerPagados,
    insertarPagados,
    obtenerCreditosTesoreria,
    obtenerCreditosTesoreriaTerceros,
    pagoApoderados
};


