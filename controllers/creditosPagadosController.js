const { insertarPagados, insertarPagadosLote, obtenerPagados, obtenerCreditosTesoreria, obtenerCreditosTesoreriaTerceros, pagoApoderados } = require('../models/creditosPagadosModel');

const contarPagados = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        const fechaInicioObj = new Date();
        fechaInicioObj.setDate(1);

        const fechaFinObj = new Date();

        const formatoAS400 = (fecha) => {
            const fechaObj = new Date(fecha);
            const anioAS400 = (fechaObj.getFullYear() - 1900).toString().slice(-2);
            const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaObj.getDate()).padStart(2, '0');

            return `1${anioAS400}${mes}${dia}`;
        };

        // Convertir las fechas al formato AS400
        const fechaInicioAS400 = formatoAS400(fechaInicioObj);
        const fechaFinAS400 = formatoAS400(fechaFinObj);
        const pagados = await obtenerPagados(fechaInicioAS400, fechaFinAS400);
        res.json({ pagados });

    } catch (error) {
        console.error('❌ Error en contarPagados:', error);
        res.status(500).json({ error: 'Error al obtener los pagarés pagados' });
    }
};

const guardarPagado = async (req, res) => {
    try {
        const datos = req.body;
        const resultado = await insertarPagados(datos);

        return res.status(resultado.success ? 201 : 409).json({
            success: resultado.success,
            message: resultado.message
        });

    } catch (error) {
        console.error('❌ Error en guardarPagado:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al guardar el pagaré pagado.'
        });
    }
};

const guardarPagadosLote = async (req, res) => {
    try {
        const creditos = req.body;

        const resultado = await insertarPagadosLote(creditos);

        return res.status(resultado.success ? 201 : 400).json({
            success: resultado.success,
            message: resultado.message
        });

    } catch (error) {
        console.error('❌ Error en guardarPagadosLote:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al guardar los pagarés pagados en lote.'
        });
    }
};


const verCreditosTesoreria = async (req, res) => {
    try {
        const data = await obtenerCreditosTesoreria();

        const dataLimpia = data.map((item) => {
            const nuevoItem = {};
            for (const key in item) {
                const valor = item[key];
                // Si es string, aplicar trim
                nuevoItem[key] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return nuevoItem;
        });

        res.json(dataLimpia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los créditos en tesorería' });
    }
};

const verCreditosTesoreriaTerceros = async (req, res) => {
    try {
        const data = await obtenerCreditosTesoreriaTerceros();

        const dataLimpia = data.map((item) => {
            const nuevoItem = {};
            for (const key in item) {
                const valor = item[key];
                // Si es string, aplicar trim
                nuevoItem[key] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return nuevoItem;
        });

        res.json(dataLimpia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los créditos en tesorería' });
    }
};

const verpagoApoderados = async (req, res) => {
    try {
        const data = await pagoApoderados();

        // Limpiar los datos
        const dataLimpia = data.map((item) => {
            const nuevoItem = {};
            for (const key in item) {
                const valor = item[key];
                // Si es string, aplicar trim
                nuevoItem[key] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return nuevoItem;
        });

        res.json(dataLimpia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos de apoderados' });
    }
};



module.exports = { contarPagados, guardarPagado, guardarPagadosLote, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados };
