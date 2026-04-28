/*
   Rutas unificadas para el manejo de formularios.
   Maneja: Vista principal, Registro de usuario y Recuperación de contraseña.
*/

import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";
import { 
    mostrarFormulario, 
    mostrarFormularioRegistro, 
    registrarUsuario, 
    loginUsuario,
    recuperarPassword 
} from "../controllers/formControllers.js";

// Configuración necesaria para manejar rutas de archivos con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- RUTAS PARA VISTAS (GET) ---

// Ruta raíz: Muestra el formulario principal (Login / InForm.html)
router.get("/", mostrarFormulario);

// Ruta para ver el formulario de registro (FormularioCrear.html)
router.get("/registro", mostrarFormularioRegistro);

// Ruta para ver el formulario de recuperación
router.get("/recuperar", (req, res) => {
    // Nota: Asegúrate de que la carpeta se llame "public" o "Public" según tu proyecto
    res.sendFile(path.join(__dirname, "../public/html/Conform.html"));
});


// --- RUTAS PARA PROCESAR DATOS (POST) ---

// Procesa el registro de un nuevo usuario
router.post("/", loginUsuario);
router.post("/registro", registrarUsuario);
// Procesa la solicitud de recuperación de contraseña
router.post("/recuperar", recuperarPassword);

export default router;