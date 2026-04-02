import path from "path";
import { fileURLToPath } from "url";
// Importamos los servicios que ya tienen la lógica de la base de datos
import { 
    registrarUsuarioService, 
    procesarLogin, 
    procesarCambioPassword 
} from "../services/services.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- VISTAS (GET) ---
// Estas funciones solo sirven para mostrar las páginas HTML

export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/InForm.html"));
};

export const mostrarFormularioRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/FormularioCrear.html"));
};

export const mostrarInicio = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/InicioSesion.html"));
};

// --- LÓGICA DE NEGOCIO (POST) ---
// Estas funciones reciben datos y responden éxito o error

// 1. Registro
export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await registrarUsuarioService(req.body);
        return res.status(200).json({
            ok: true,
            mensaje: "¡Usuario registrado con éxito!",
            data: resultado
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            mensaje: error.message 
        });
    }
};

// 2. Login
export const loginUsuario = async (req, res) => { 
    try {
        const { correo, password } = req.body;
        
        // Validación básica de campos vacíos
        if (!correo || !password) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: "El correo y la contraseña son obligatorios." 
            });
        }
        
        const resultado = await procesarLogin(req.body);
        
        return res.status(200).json({
            ok: true,
            mensaje: `¡Bienvenido, ${resultado.nombre}!`,
            data: resultado
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            mensaje: error.message 
        });
    }
};

// 3. Recuperación (Cambio de contraseña)
export const recuperarPassword = async (req, res) => {
    try {
        // Toda la lógica de bcrypt y buscar usuario ahora vive en el service
        const resultado = await procesarCambioPassword(req.body);
        
        return res.status(200).json({ 
            ok: true, 
            mensaje: resultado.mensaje 
        });
    } catch (error) {
        return res.status(400).json({ 
            ok: false, 
            mensaje: error.message 
        });
    }
};