/**
 * Encargado de procesar las peticiones
 */
import path from "path";
import fs from "fs/promises"; 
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs"; 
import { procesarFormulario, procesarRecuperacion, registrarUsuarioService } from "../services/services.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURACIÓN DE DATOS ---
const dataPath = path.join(__dirname, "../data/usuarios.json");

// Funciones internas para manejar el JSON
const leerJSON = async () => {
    try {
        const contenido = await fs.readFile(dataPath, "utf-8");
        return JSON.parse(contenido);
    } catch (error) {
        return []; // Si el archivo no existe, devuelve lista vacía
    }
};

const guardarUsuarios = async (usuarios) => {
    await fs.writeFile(dataPath, JSON.stringify(usuarios, null, 2));
};

// --- VISTAS (GET) ---

export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/InForm.html"));
};

export const mostrarFormularioRegistro = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/FormularioCrear.html"));
};

// --- LÓGICA DE NEGOCIO (POST) ---

// 1. Registro de Usuario
export const registrarUsuario = async (req, res) => {
    try {
       const resultado = await registrarUsuarioService(req.body);
       res.status(200).json({
            ok: true,
            mensaje: "¡Usuario registrado con éxito!",
            data: resultado
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message 
        });
    }
};

// 2. Inicio de Sesión
export const loginUsuario = async (req, res) => { 
    try {
        const resultado = await procesarFormulario(req.body);

        res.status(200).json({
            ok: true,
            mensaje: `¡Bienvenido, ${resultado.usuario}!`,
            data: resultado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message 
        });
    }
};

// 3. Recuperación de Contraseña
export const recuperarPassword = async (req, res) => {
    try {
        const { correo, respuesta, nuevaPassword } = req.body;
        
        // Ahora estas funciones sí existen en este archivo
        const usuarios = await leerJSON();

        // 1. Buscar al usuario
        const index = usuarios.findIndex(u => u.correo === correo);
        if (index === -1) throw new Error("El correo no está registrado");

        // 2. Verificar la palabra secreta (Bcrypt) contra 'respuestarc' que es el campo del JSON
        const esValida = await bcrypt.compare(respuesta, usuarios[index].respuestarc);
        if (!esValida) throw new Error("La palabra secreta es incorrecta");

        // 3. Validar longitud de nueva contraseña
        if (!nuevaPassword || nuevaPassword.length < 8) {
            throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
        }

        // 4. Encriptar la NUEVA contraseña
        const salt = await bcrypt.genSalt(10);
        usuarios[index].password = await bcrypt.hash(nuevaPassword, salt);

        // 5. Guardar cambios en el archivo JSON
        await guardarUsuarios(usuarios);

        res.status(200).json({ 
            ok: true, 
            mensaje: "¡Contraseña actualizada con éxito! Ya puedes iniciar sesión." 
        });
 
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

  //4. Inicio Sesion
    export const mostrarInicio = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/InicioSesion.html"));
    };    
