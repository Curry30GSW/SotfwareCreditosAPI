const { insertarPagados, buscarCreditoPorCedula, insertarPagadosLote, obtenerPagados, obtenerCreditosTesoreria, obtenerCreditosTesoreriaTerceros, pagoApoderados, obtenerCreditosPorCedula, registrarAuditoriaMod } = require('../models/creditosPagadosModel');
const path = require('path');

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
        console.log('📌 Punto 1: req.body =>', req.body)

        const datos = req.body;
        const cedula = req.body.cedula;

        if (!cedula) {
            return res.status(400).json({ error: 'Cédula no proporcionada' });
        }

        // 1. Buscar si ya hay un comprobante existente para ese crédito
        const creditoExistente = await buscarCreditoPorCedula(cedula);

        if (creditoExistente && creditoExistente.comprobante && req.file) {
            // Si ya existe comprobante y el estado es "si", no se permite reemplazo
            return res.status(400).json({
                success: false,
                message: 'Ya se subió un comprobante para este crédito aprobado.'
            });
        }

        // 2 
        if (req.file) {
            const fs = require('fs');
            const oldPath = req.file.path;
            const newFilename = `comprobante-${cedula}${path.extname(req.file.originalname)}`;
            const newPath = path.join(req.file.destination, newFilename);

            await fs.promises.rename(oldPath, newPath);

            req.body.comprobante = newFilename; // Ruta relativa para mostrar

            // Renombrar el archivo
            // fs.rename(oldPath, newPath, (err) => {
            //     if (err) {
            //         return res.status(500).json({ error: 'Error al renombrar el archivo' });
            //     }

            //     res.json({ mensaje: 'Archivo subido correctamente', archivo: newFilename });
            // });    
        }

        // se insertar el credto
        const resultado = await insertarPagados(datos);

        return res.status(resultado.success ? 201 : 400).json({
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

const getCreditosPorCedula = async (req, res) => {
    const { cedula } = req.params;

    try {
        const creditos = await obtenerCreditosPorCedula(cedula);

        if (creditos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron créditos para esta cédula.' });
        }

        // Limpiar espacios en los campos tipo string
        const creditosLimpios = creditos.map(credito => {
            const limpio = {};
            for (const key in credito) {
                const valor = credito[key];
                limpio[key.trim()] = typeof valor === 'string' ? valor.trim() : valor;
            }
            return limpio;
        });

        res.status(200).json(creditosLimpios);
    } catch (error) {
        console.error('❌ Error en el controlador de créditos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los créditos.', error: error.message });
    }
};

const registrarAuditoriaModulo = async (req, res) => {

    try {
        const { nombre_usuario, rol } = req.body;

        // Capturar IP real desde la conexión
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        // Limpiar el "::ffff:" si existe
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        const detalle_actividad = `${nombre_usuario} ingresó al modulo TESORERIA `;

        // Registrar en la auditoría
        await registrarAuditoriaMod(
            nombre_usuario,
            rol,
            ip,
            detalle_actividad
        );
        res.json({ status: 'ok', message: 'Auditoría registrada correctamente' });
    } catch (error) {
        console.error('❌ Error al registrar auditoría de estado de crédito:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo registrar la auditoría' });
    }


}


module.exports = { contarPagados, guardarPagado, guardarPagadosLote, verCreditosTesoreria, verCreditosTesoreriaTerceros, verpagoApoderados, getCreditosPorCedula, registrarAuditoriaModulo };
