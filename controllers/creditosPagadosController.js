const { obtenerPagados } = require('../models/creditosPagadosModel');

const contarPagados = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Las fechas son obligatorias' });
        }

        // Convertir la fecha de inicio a primer día del mes actual
        const fechaInicioObj = new Date();  // Fecha actual
        fechaInicioObj.setDate(1);  // Establecer el primer día del mes

        // Convertir fecha fin a la fecha de hoy
        const fechaFinObj = new Date(); // Fecha de hoy (sin modificar)

        // Convertir las fechas al formato AS400 (1AAMMDD)
        const formatoAS400 = (fecha) => {
            const fechaObj = new Date(fecha);
            const anioAS400 = (fechaObj.getFullYear() - 1900).toString().slice(-2); // Ej: 2025 → '25'
            const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Ej: 4 → '04'
            const dia = String(fechaObj.getDate()).padStart(2, '0'); // Ej: 1 → '01'

            return `1${anioAS400}${mes}${dia}`;
        };

        // Convertir las fechas al formato AS400
        const fechaInicioAS400 = formatoAS400(fechaInicioObj);  // Primer día del mes
        const fechaFinAS400 = formatoAS400(fechaFinObj);  // Fecha actual (hoy)
        const pagados = await obtenerPagados(fechaInicioAS400, fechaFinAS400);
        res.json({ pagados });

    } catch (error) {
        console.error('❌ Error en contarPagados:', error);
        res.status(500).json({ error: 'Error al obtener los pagarés pagados' });
    }
};


module.exports = { contarPagados };
