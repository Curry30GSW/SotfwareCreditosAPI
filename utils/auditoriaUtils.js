// auditoriaUtils.js

function getActividad(tipo, modulo = '') {
    const modulos = {
        'creditos_pagare': 'Módulo Créditos - Software Pagaré',
        'cartera': 'Módulo Cartera',
        'agencias': 'Módulo Agencias',
        'usuarios': 'Módulo Administración de Usuarios',
        // Agrega más módulos según lo que tengas en tu aplicación
    };

    switch (tipo) {
        case 'login':
            return 'Inicio de sesión exitoso';
        case 'logout':
            return 'Cierre de sesión';
        case 'acceso_modulo':
            return `Acceso al ${modulos[modulo] || 'módulo desconocido'}`;
        case 'login_fallido':
            return 'Intento fallido de inicio de sesión';
        default:
            return 'Actividad desconocida';
    }
}

module.exports = {
    getActividad
};
