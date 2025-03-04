const creditosAS400 = require('../models/creditosAS400Model');

const getCreditosAS400 = async (req, res) => {
    try {
        const data = await creditosAS400.getCreditosAS400();

        // Limpiar los espacios en los campos de tipo string
        const cleanedData = data.map(credito => {
            return {
                ...credito,
                NNIT05: credito.NNIT05 ? credito.NNIT05.trim() : credito.NNIT05,
                DESC05: credito.DESC05 ? credito.DESC05.trim() : credito.DESC05,
                DIRE05: credito.DIRE05 ? credito.DIRE05.trim() : credito.DIRE05,
                CIUD05: credito.CIUD05 ? credito.CIUD05.trim() : credito.CIUD05,
                DESC06: credito.DESC06 ? credito.DESC06.trim() : credito.DESC06,
                CLAS06: credito.CLAS06 ? credito.CLAS06.trim() : credito.CLAS06,
                CPTO13: credito.CPTO13 ? credito.CPTO13.trim() : credito.CPTO13
            };
        });

        res.status(200).json(cleanedData); // Devuelve los datos limpios al frontend
    } catch (error) {
        console.error('Error en el controlador al obtener créditos:', error);
        res.status(500).json({ error: 'Error al obtener los créditos' });
    }
};

const contarCreditosAS400 = async (req, res) => {
    try {
        const totalCreditos = await creditosAS400.contarCreditosAS400();
        res.json({ total: totalCreditos });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar los créditos' });
    }
};



module.exports = { getCreditosAS400, contarCreditosAS400 };


