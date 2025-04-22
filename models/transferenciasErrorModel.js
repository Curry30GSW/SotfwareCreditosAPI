const { executeQuery } = require('../config/db');

const obtenerTransferenciasRechazadas = async (cuentas, fecha) => {
    try {
        const cuentasCondition = Array.isArray(cuentas) ? `AND ACP16.NCTA16 IN (${cuentas.map(cuenta => `'${cuenta}'`).join(',')})` : `AND ACP16.NCTA16 = '${cuentas}'`;
        const fechaCondition = `AND ACP16.FECH16 = ${fecha}`;

        const query = `
           SELECT 
                DIST05, CB_TID, CB_ID, CB_CUENTA, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, ACP16.NCTA16, ACP16.SCAP16 VALOR, ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16
                FROM COLIB.ACP16 ACP16, COLIB.ACP160 ACP160, COLIB.CTASBAN cta, COLIB.BANCOS BN, COLIB.ACP05
                WHERE 
                ACP16.EMPR16 = '01' AND 
                ACP16.FECH16 = ACP160.FECH16 AND ACP16.HORA16 = ACP160.HORA16 AND ACP16.AGEN16 = ACP160.AGEN16 AND
                CB_CUENTA = NCTA05 AND 
                CB_CUENTA = ACP16.NCTA16 AND NDOC16 = '' ${fechaCondition}
                ${cuentasCondition}
                AND ACP16.SCAP16 > 0 
                AND cta.CB_BANCO = BN.BN_BANCO 
                AND ACP16.CBCO16 = 'TB' 
                AND ACP160.DET116 = '' 
                AND ACP16.CTRA16 = '5' 
                AND ACP16.TTRA16 IN ('DA','DE','RE','PE','PO','PR')
                ORDER BY DIST05, CB_CUENTA
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerTransferenciasRechazadas:', error);
        throw error;
    }
};

const obtenerTransferenciasRechazadasTerceros = async (cuentas, fecha) => {
    try {
        const cuentasCondition = Array.isArray(cuentas)
            ? `AND ACP16.NCTA16 IN (${cuentas.map(c => `'${c}'`).join(',')})`
            : `AND ACP16.NCTA16 = '${cuentas}'`;

        const fechaCondition = `AND ACP16.FECH16 = ${fecha}`;

        const query = `
            SELECT 
                CB_TID, CB_ID, CB_DIGITO, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, ACP16.NCTA16,
                ACP13.CHGI13 AS VALOR, ACP16.CBCO16, ACP16.CTRA16, ACP16.TTRA16
            FROM 
                COLIB.ACP16 ACP16, 
                COLIB.ACP160 ACP160, 
                COLIB.CTASPROV CTA,
                COLIB.BANCOS BN,
                COLIB.ACP13 ACP13
            WHERE 
                ACP16.EMPR16 = '01'
                AND ACP16.FECH16 = ACP160.FECH16
                AND ACP16.HORA16 = ACP160.HORA16
                AND (ACP13.CHGI13 > 0 OR ACP13.ORSU13 > 0)
                AND (CB_ID = ACP160.DET116 OR CB_ID = ACP160.DET216)
                AND (CB_CTABCO = ACP160.DET416 OR CB_CTABCO = ACP160.DET316)
                AND ACP16.FECH16 = ACP13.FECI13
                AND ACP16.NCTA16 = ACP13.NCTA13
                AND CTA.CB_ESTADO = 0
                AND CTA.CB_BANCO = BN.BN_BANCO
                AND ACP16.CBCO16 IN ('TB', 'OS')
                AND ACP160.DET116 <> ''
                AND ACP16.CTRA16 IN ('3', '5')
                AND ACP16.TTRA16 IN ('DA','DE','RE','PE','PO','PR')
                ${fechaCondition}
                ${cuentasCondition}
            ORDER BY 
                ACP16.NCTA16
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerTransferenciasRechazadasTerceros:', error);
        throw error;
    }
};





module.exports = {
    obtenerTransferenciasRechazadas,
    obtenerTransferenciasRechazadasTerceros
};