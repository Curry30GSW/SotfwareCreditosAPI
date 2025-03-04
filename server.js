const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToAS400, connectToPagares } = require('./config/db');
const bodyParser = require('body-parser');
const creditosAS400Routes = require('./routes/creditosAS400Routes');
const creditosPagaresRoutes = require('./routes/creditosPagaresRoutes');
const conciliacionRoutes = require('./routes/conciliacionRoutes');
const creditosPendientesRoutes = require('./routes/creditosPendientesRoutes');
const creditosPagadosRoutes = require('./routes/creditosPagadosRoutes');
const analisisRoutes = require('./routes/analisisRoutes');
const analisisConteo = require('./routes/analisisConteoRoutes');
const detallesAnalisis = require('./routes/detallesAnalisisRoutes');

dotenv.config();

// Configuración de Express
const app = express();

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: "http://127.0.0.1:5500", // Especifica el origen permitido
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Headers permitidos
}));

// Ruta raíz para verificar que la API está funcionando
app.get('/', (req, res) => {
    res.send('API running');
});

app.use(bodyParser.json());

// Configuración del servidor
const PORT = process.env.PORT || 5000;

//Ruta créditos desembolsados AS400
app.use('/api', creditosAS400Routes);

//RUTA
app.use('/api', creditosPagaresRoutes);

// Ruta Modulo conciliación
app.use('/api', conciliacionRoutes);

//Rutas créditos pendientes ultimos 3 meses
app.use('/api', creditosPendientesRoutes);

app.use('/api', creditosPagadosRoutes);

//Ruta analisis
app.use('/api', analisisRoutes);

app.use('/api', analisisConteo);

app.use('/api', detallesAnalisis);

// Validar conexión a la base de datos y arrancar el servidor
const startServer = async () => {
    try {
        await connectToAS400();
        await connectToPagares();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a las bases de datos. Verifica la configuración.');
        process.exit(1);
    }
};

startServer();