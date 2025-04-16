const { executeQuery } = require('../config/db');

const obtenerAporteSociales = async () => {
    try {
        const query = `
            SELECT 
                DIST05, CB_TID, CB_ID, CB_CUENTA, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, NCTA16, SCAP16 AS VALOR, CBCO16, CTRA16 
            FROM COLIB.ACP16, COLIB.CTASBAN cta, COLIB.BANCOS BN, COLIB.ACP05
            WHERE 
                EMPR16 = '01' AND 
                CB_CUENTA = NCTA05 AND
                CB_CUENTA = NCTA16 AND
                FECH16 = '1250414' AND
                cta.CB_BANCO = BN.BN_BANCO AND
                CBCO16 = 'TB' AND
                CTRA16 = '5' AND 
                TTRA16 = 'DA'
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerAporteSociales:', error);
        throw error;
    }
};

const obtenerAporteOcasionales = async () => {
    try {
        const query = `
            SELECT 
                DIST05, CB_TID, CB_ID, CB_CUENTA, CB_BANCO, BN_DESCR, CB_CTABCO, CB_TIPO, CB_FECHA, CB_ESTADO,
                CB_NOMBRE, CB_MAIL, CB_CIUDAD, NCTA16, SCAP16 AS VALOR, CBCO16, CTRA16 
            FROM COLIB.ACP16, COLIB.CTASBAN cta, COLIB.BANCOS BN, COLIB.ACP05
            WHERE 
                EMPR16 = '01' AND 
                CB_CUENTA = NCTA05 AND
                CB_CUENTA = NCTA16 AND
                FECH16 = '1250414' AND
                cta.CB_BANCO = BN.BN_BANCO AND
                CBCO16 = 'TB' AND
                CTRA16 = '5' AND 
                TTRA16 = 'RE'
        `;

        const resultado = await executeQuery(query, [], 'AS400');
        return resultado;

    } catch (error) {
        console.error('❌ Error en obtenerAporteOcasionales:', error);
        throw error;
    }
};

module.exports = {
    obtenerAporteSociales,
    obtenerAporteOcasionales
};
