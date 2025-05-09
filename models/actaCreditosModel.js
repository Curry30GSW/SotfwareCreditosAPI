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
                ACP13.FECI13 = 1250507 AND 
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
                ACP13.FECI13 = 1250507 AND 
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
          SELECT 
            ACP24.DIST24, 
            ACP24.NCTA24, 
            CTA.CB_ID, 
            ACP05.DESC05, 
            ACP24.NREI24, 
            ACP03.DESC03, 
            ACP24.STAT24, 
            ACP24.VREI24, 
            ACP24.FECH24, 
            ACP24.STAP24,
            ACP24.FECH24, 
            CTA.CB_TIPO
        FROM 
            C707D8E1.COLIB.ACP05 ACP05, 
            C707D8E1.COLIB.ACP24 ACP24, 
            C707D8E1.COLIB.BANCOS BN, 
            C707D8E1.COLIB.CTASBAN CTA, 
            C707D8E1.COLIB.ACP03 ACP03
        WHERE 
            ACP05.NCTA05 = CTA.CB_CUENTA 
            AND ACP24.NCTA24 = CTA.CB_CUENTA 
            AND ACP24.NCTA24 = ACP05.NCTA05 
            AND CTA.CB_BANCO = BN.BN_BANCO 
            AND ACP24.DIST24 = ACP03.DIST03 
            AND ACP24.FECH24 = 1250507
            AND ACP24.STAP24 = '5'


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