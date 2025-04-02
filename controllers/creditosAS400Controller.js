const creditosAS400 = require('../models/creditosAS400Model');

const getCreditosAS400 = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend (formato DD-MM-YYYY)

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        // Función para convertir la fecha al formato AS400 (1AAMMDD)
        const formatoAS400 = (fecha) => {
            const [dia, mes, anio] = fecha.split('-'); // Separar la fecha recibida en partes
            const anioAS400 = (parseInt(anio) - 1900).toString().slice(-2); // Convertir año a formato AS400
            return `1${anioAS400}${mes}${dia}`; // Retornar en formato 1AAMMDD
        };

        // Convertir las fechas recibidas al formato AS400
        const fechaInicioAS400 = formatoAS400(fechaInicio);
        const fechaFinAS400 = formatoAS400(fechaFin);


        // Llamar a la función del modelo para obtener créditos con las fechas convertidas
        const data = await creditosAS400.getCreditosAS400(fechaInicioAS400, fechaFinAS400);

        // Limpiar los espacios en los campos de tipo string
        const cleanedData = data.map(credito => ({
            ...credito,
            NNIT05: credito.NNIT05 ? credito.NNIT05.trim() : credito.NNIT05,
            DESC05: credito.DESC05 ? credito.DESC05.trim() : credito.DESC05,
            DESC03: credito.DESC03 ? credito.DESC03.trim() : credito.DESC03,
            DIRE03: credito.DIRE03 ? credito.DIRE03.trim() : credito.DIRE03,
            DESC04: credito.DESC04 ? credito.DESC04.trim() : credito.DESC04,
            DESC06: credito.DESC06 ? credito.DESC06.trim() : credito.DESC06,
            CLAS06: credito.CLAS06 ? credito.CLAS06.trim() : credito.CLAS06,
            CPTO13: credito.CPTO13 ? credito.CPTO13.trim() : credito.CPTO13
        }));

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


