import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import formRoutes from "./routes/formRoutes.js";

const app = express();
const PORT = 3000; // Solo una vez declaramos el puerto

// Configuración de rutas para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cargar los certificados (Si no los tienes físicamente, comenta estas líneas)
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

// 2. Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'awademolepasilloamarillo', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// 4. Archivos estáticos
app.use("/", express.static(path.join(__dirname, "public")));

// 5. Rutas
app.get('/test-secure', (req, res) => {
  res.send('¡Conexión segura establecida!');
});

app.use("/", formRoutes);

// 6. Iniciar Servidores
// Servidor HTTP normal
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Servidor HTTPS (Opcional, compartiendo el mismo puerto o usando 443)
https.createServer(options, app).listen(443, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:443`);
});