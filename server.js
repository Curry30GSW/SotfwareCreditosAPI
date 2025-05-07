const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToAS400, connectToPagares } = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const creditosAS400Routes = require('./routes/creditosAS400Routes');
const creditosPagaresRoutes = require('./routes/creditosPagaresRoutes');
const conciliacionRoutes = require('./routes/conciliacionRoutes');
const creditosPendientesRoutes = require('./routes/creditosPendientesRoutes');
const creditosPagadosRoutes = require('./routes/creditosPagadosRoutes');
const analisisRoutes = require('./routes/analisisRoutes');
const analisisConteo = require('./routes/analisisConteoRoutes');
const detallesAnalisis = require('./routes/detallesAnalisisRoutes');
const analisisResumen = require('./routes/analisisResumenRoutes');
const authRoutes = require('./middlewares/authRoutes');
const creditosNoRegistradosRoutes = require('./routes/creditosNoRegistradosRoutes');
const agenciaRoutes = require('./routes/analisisConteoParcialRoutes');
const aportesRoutes = require('./routes/devolucionAportesRoutes');
const transError = require('./routes/transferenciasErrorRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const actaCreditosRoutes = require('./routes/actaCreditosRoutes');

dotenv.config();

// Configuración de Express
const app = express();
app.use(express.json());
app.use(cookieParser());



app.use(cors({
    origin: "http://127.0.0.1:5500", // Debes usar el frontend correcto
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // 🛑 Habilita las cookies en CORS
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

//RUTA CREDITOS NO REGISTRADOS
app.use('/api', creditosNoRegistradosRoutes);

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

app.use('/api', analisisResumen);

app.use('/api', actaCreditosRoutes);

//Ruta Login
app.use('/auth', authRoutes);

app.use('/api', agenciaRoutes);

app.use('/api', aportesRoutes);

app.use('/api', transError);

app.use('/api', auditoriaRoutes);

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