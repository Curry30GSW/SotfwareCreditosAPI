const { executeQuery } = require('../config/db');


const obtenerActaVirtuales = async () => {
    try {
        const fechaAS400 = getFechaHoyAS400(); // Obtener fecha actual AS400

        const query = `
            SELECT 
                ACP05.DIST05, 
                ACP05.NCTA05, 
                ACP03.DESC03, 
                ACP05.NNIT05, 
                ACP05.DESC05, 
                ACP13.TCRE13, 
                ACP13.NCRE13, 
                ACP13.CAPI13, 
                ACP13.SCAP13, 
                ACP13.CHGI13, 
                ACP16.TTRA16, 
                ACP16.CTRA16, 
                ACTACRED.ACTA, 
                ACTACRED.POSICION, 
                SCAP13 - SSEG13 - VFOG13 - INTP13 - CAAP13 - ESCR13 - REOR13 - REES13 - REOC13 - CHGI13 - ORSU13 + (OTRO13 + SIMO13) AS DESEMBOLSO
            FROM 
                C707D8E1.COLIB.ACP03 ACP03, 
                C707D8E1.COLIB.ACP05 ACP05, 
                C707D8E1.COLIB.ACP13 ACP13, 
                C707D8E1.COLIB.ACP16 ACP16, 
                C707D8E1.COLIB.ACTACRED ACTACRED
            WHERE 
                ACP05.NCTA05 = ACP13.NCTA13 AND 
                ACP03.DIST03 = ACP05.DIST05 AND 
                ACP13.NCTA13 = ACP16.NCTA16 AND     
                ACP13.NCRE13 = ACP16.NCRE16 AND 
                ACP13.NANA13 = ACTACRED.ANALISIS AND 
                ACP13.NCTA13 = ACTACRED.CUENTA AND 
                ACP13.FECI13 = ${fechaAS400} AND 
                ACP16.CTRA16 = '5'
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;
    } catch (error) {
        console.error('❌ Error en obtenerActaVirtuales:', error);
        throw error;
    }
};

const obtenerActaTerceros = async () => {
    try {
        const fechaAS400 = getFechaHoyAS400(); // Obtener fecha actual AS400

        const query = `
            SELECT 
                ACP05.DIST05, 
                ACP05.NCTA05, 
                ACP03.DESC03, 
                ACP05.NNIT05, 
                ACP05.DESC05, 
                ACP13.TCRE13, 
                ACP13.NCRE13, 
                ACP13.CAPI13, 
                ACP13.SCAP13, 
                ACP13.CHGI13, 
                ACP16.TTRA16, 
                ACP16.CTRA16, 
                ACTACRED.ACTA, 
                ACTACRED.POSICION, 
                CTASPROV.CB_NOMBRE, 
                CTASPROV.CB_ID, 
                CTASPROV.CB_DIGITO
            FROM 
                C707D8E1.COLIB.ACP03 ACP03, 
                C707D8E1.COLIB.ACP05 ACP05, 
                C707D8E1.COLIB.ACP13 ACP13, 
                C707D8E1.COLIB.ACP16 ACP16, 
                C707D8E1.COLIB.ACP160 ACP160, 
                C707D8E1.COLIB.ACTACRED ACTACRED, 
                C707D8E1.COLIB.CTASPROV CTASPROV
            WHERE 
                ACP05.NCTA05 = ACP13.NCTA13 AND 
                ACP03.DIST03 = ACP05.DIST05 AND 
                ACP13.NCTA13 = ACP16.NCTA16 AND 
                ACP13.NCRE13 = ACP16.NCRE16 AND 
                ACP13.NANA13 = ACTACRED.ANALISIS AND 
                ACP13.NCTA13 = ACTACRED.CUENTA AND 
                ACP16.FECH16 = ACP160.FECH16 AND 
                ACP16.HORA16 = ACP160.HORA16 AND 
                CTASPROV.CB_ID = ACP160.DET116 AND 
                ACP160.DET416 = CTASPROV.CB_CTABCO AND 
                ACP13.FECI13 = ${fechaAS400} AND 
                ACP16.CTRA16 = '5'
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;
    } catch (error) {
        console.error('❌ Error en obtenerActaTerceros:', error);
        throw error;
    }
};

const obtenerActaExcedencias = async () => {
    try {
        const fechaAS400 = getFechaHoyAS400(); // Obtener fecha actual AS400

        const query = `
            SELECT ACP05.DIST05, ACP03.DESC03, cta.CB_TID, cta.CB_ID, cta.CB_CUENTA, cta.CB_BANCO, BN.BN_DESCR, 
                   cta.CB_CTABCO, cta.CB_TIPO, cta.CB_FECHA, cta.CB_ESTADO, cta.CB_NOMBRE, cta.CB_MAIL, 
                   cta.CB_CIUDAD, ACP16.NCTA16, ACP16.NCRE16, ACP16.SCAP16, ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16, ACP16.FECH16, ACP16.CTRA16
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
                ACP16.FECH16 = ${fechaAS400} AND 
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
                ACP16.TTRA16 IN ('DA','DE','RE')
            ORDER BY ACP05.DIST05, cta.CB_CUENTA
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;
    } catch (error) {
        console.error('❌ Error en obtenerActaExcedencias:', error);
        throw error;
    }
};



const getFechaHoyAS400 = () => {
    const hoy = new Date();
    const año = hoy.getFullYear().toString().slice(-2); // últimos 2 dígitos del año
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth es base 0
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `1${año}${mes}${dia}`; // ejemplo: 1250505
};

const registrarAuditoriaMod = async (nombre_usuario, rol, ip_usuario, detalle_actividad) =>{
    const query = `INSERT INTO conciliacion_auditoria 
        (nombre_usuario, rol, ip_usuario, fecha_acceso, hora_acceso, detalle_actividad) 
        VALUES (?, ?, ?, NOW(), NOW(), ?)
        `;
        
        await executeQuery(query, [nombre_usuario, rol, ip_usuario, detalle_actividad

    ], 'PAGARES')

}


module.exports = {
    obtenerActaTerceros,
    obtenerActaVirtuales,
    obtenerActaExcedencias,
    registrarAuditoriaMod
};