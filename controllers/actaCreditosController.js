const actaCreditosModel = require('../models/actaCreditosModel');

// Función para limpiar espacios de las propiedades de los objetos
const limpiarData = (data) => {
    return data.map((item) => {
        let cleanedItem = {};
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                // Eliminar espacios en las propiedades y en los valores de las propiedades
                cleanedItem[key.trim()] = (item[key] && typeof item[key] === 'string') ? item[key].trim() : item[key];
            }
        }
        return cleanedItem;
    });
};

const getActaTerceros = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaTerceros();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de terceros', error });
    }
};

const getActaVirtuales = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaVirtuales();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de virtuales', error });
    }
};

const getActaExcedencias = async (req, res) => {
    try {
        const datos = await actaCreditosModel.obtenerActaExcedencias();
        const datosLimpios = limpiarData(datos);
        res.status(200).json(datosLimpios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener acta de excedencias', error });
    }
};

module.exports = {
    getActaTerceros,
    getActaVirtuales,
    getActaExcedencias
};
