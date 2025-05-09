const { executeQuery } = require('../config/db');

const obtenerCreditosCedula = async (cedula) => {
  try {
    const tableACP13 = `COLIB.ACP13`;
    const tableACP05 = `COLIB.ACP05`;

        const query = `
                SELECT 
                TRIM(${tableACP05}.NNIT05) AS NNIT05,
                TRIM(${tableACP05}.DESC05) AS DESC05,
                ${tableACP13}.NCTA13, 
                ${tableACP13}.NCRE13, 
                ${tableACP13}.NANA13, 
                ${tableACP13}.TCRE13, 
                ${tableACP13}.CAPI13, 
                ${tableACP13}.SCAP13,
                ${tableACP13}.SINT13,
                ${tableACP13}.AGOP13,
                ${tableACP13}.FECI13,
                ${tableACP13}.FEC113,  
                ${tableACP13}.FECU13   
            FROM 
                ${tableACP13}
            INNER JOIN 
                ${tableACP05}
            ON 
                ${tableACP13}.NCTA13 = ${tableACP05}.NCTA05
            WHERE 
                TRIM(${tableACP05}.NNIT05) = ?`;

        console.log('Consulta generada:', query);
        const resultado = await executeQuery(query, [cedula], 'AS400');
        return resultado;

  } catch(e) {

    console.error('❌ Error en obtenerInfo:', e);
        throw e;

  }

};

const registrarAuditoriaMod = async (nombre_usuario, rol, ip_usuario, detalle_actividad) =>{
    const query = `INSERT INTO conciliacion_auditoria 
        (nombre_usuario, rol, ip_usuario, fecha_acceso, hora_acceso, detalle_actividad) 
        VALUES (?, ?, ?, NOW(), NOW(), ?)
        `;
        
        await executeQuery(query, [nombre_usuario, rol, ip_usuario, detalle_actividad

    ], 'PAGARES')

}

module.exports = {obtenerCreditosCedula,
    registrarAuditoriaMod
};