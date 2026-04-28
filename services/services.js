<<<<<<< HEAD
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
=======
>>>>>>> c8681d5b4293968b8ca87efbd31f8755d6d48d37
import bcrypt from 'bcryptjs';
import { 
    writeUser, 
    findUserByEmail, 
    existsUser, 
    updatePassword 
} from '../models/models.js';

<<<<<<< HEAD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta a "base de datos" JSON
const dbPath = path.resolve(__dirname, '../data/usuarios.json');

// --- RUTINAS DE APOYO ---
const leerJSON = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Retorna array vacío si el archivo no existe
    }
};

const guardarUsuarios = async (usuarios) => {
    await fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2));
};

// --- SERVICIOS ---

/**
 * Lógica para REGISTRAR un nuevo usuario
 */
export const registrarUsuarioService = async (datos) => {
    const { nombre, Telefono, correo, contrasena, contrasenaConfirmacion, preguntaRecuperacion, respuestaRecuperacion } = datos;
    const errores = {};

    // 1. Validaciones técnicas
    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) errores.nombre = "El nombre solo debe contener letras";
    if (!Telefono || !/^52\d{10}$/.test(Telefono)) errores.Telefono = "Debe iniciar con 52 y tener 10 dígitos";
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) errores.correo = "Correo inválido";
    if (!contrasena || contrasena.length < 8) errores.contrasena = "La contraseña debe tener al menos 8 caracteres";
    if (contrasena !== contrasenaConfirmacion) errores.contrasenaConfirmacion = "Las contraseñas no coinciden";

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    // 2. Verificar si ya existe
    const usuarios = await leerJSON();
    if (usuarios.find(u => u.correo === correo)) {
        throw new Error(JSON.stringify({ correo: "El correo ya está registrado" }));
    }

    // 3. Encriptar contraseñas y guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(contrasena, salt);
    const hashedRespuesta = await bcrypt.hash(respuestaRecuperacion, salt);

    const nuevoUsuario = {
        nombre,
        Telefono,
        correo,
        password: hashedPass, // Guardamos la versión encriptada
        pregunta: preguntaRecuperacion,
        respuestarc: hashedRespuesta, // Respuesta secreta encriptada
        fechaRegistro: new Date()
    };

    usuarios.push(nuevoUsuario);
    await guardarUsuarios(usuarios);

    return { nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo };
};

/**
 * Lógica para INICIAR SESIÓN (Login)
 */
export const procesarFormulario = async (datos) => {
    const { password, correo } = datos;
    const usuarios = await leerJSON();
=======
// --- REGISTRO ---
export const registrarUsuarioService = async (datos) => {
    const { nombre, Telefono, correo, contrasena, respuestaRecuperacion, preguntaId } = datos;

    if (await existsUser(correo)) {
        throw new Error(JSON.stringify({ correo: "El correo ya está registrado" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(contrasena, salt);
    const hashedRespuesta = await bcrypt.hash(respuestaRecuperacion, salt);

    await writeUser({
        nombre,
        Telefono,
        correo,
        password: hashedPass,
        preguntarc,
        respuestarc: hashedRespuesta
    });

    return { nombre };
};

// --- LOGIN ---
export const procesarLogin = async (datos) => {
    const { correo, password } = datos;

    const usuario = await findUserByEmail(correo);
    if (!usuario) throw new Error("El usuario no existe");

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) throw new Error("Contraseña incorrecta");

    return { nombre: usuario.nombre, correo: usuario.correo };
};

// --- RECUPERACIÓN ---
export const procesarCambioPassword = async (datos) => {
    const { correo, respuesta, nuevaPassword } = datos;
>>>>>>> c8681d5b4293968b8ca87efbd31f8755d6d48d37

    const usuario = await findUserByEmail(correo);
    if (!usuario) throw new Error("El correo no está registrado");

<<<<<<< HEAD
    if (!usuarioEncontrado) {
        throw new Error("El usuario no existe");
    }

    // Validar contraseña con Bcrypt
    const esValida = await bcrypt.compare(password, usuarioEncontrado.password);
    
    if (!esValida) {
        throw new Error("Contraseña incorrecta");
    }

    return {
        usuario: usuarioEncontrado.nombre,
        correo: usuarioEncontrado.correo
    };
};

/**
 * Lógica para VERIFICAR RECUPERACIÓN
 */
export const procesarRecuperacion = async (datos) => {
    const { correo, respuesta } = datos;
    const usuarios = await leerJSON();
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) throw new Error("Correo no registrado");

    // Validar palabra secreta encriptada
    const respuestaValida = await bcrypt.compare(respuesta, usuario.respuestarc);

    if (!respuestaValida) {
        throw new Error("La respuesta de seguridad es incorrecta");
    }

    return {
        mensaje: "Identidad verificada",
        instrucciones: "Validación exitosa. Ahora puedes establecer una nueva contraseña."
    };
=======
    const esValida = await bcrypt.compare(respuesta, usuario.respuestarc);
    if (!esValida) throw new Error("La palabra secreta es incorrecta");

    if (!nuevaPassword || nuevaPassword.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(nuevaPassword, salt);

    await updatePassword(correo, hashedPass);

    return { mensaje: "¡Contraseña actualizada con éxito!" };
>>>>>>> c8681d5b4293968b8ca87efbd31f8755d6d48d37
};