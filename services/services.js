import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/usuarios.json');

const leerJSON = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const guardarUsuarios = async (u) => await fs.writeFile(dbPath, JSON.stringify(u, null, 2));

// --- REGISTRO ---
export const registrarUsuarioService = async (datos) => {
    const { nombre, Telefono, correo, contrasena, respuestaRecuperacion, pregunta } = datos;
    const usuarios = await leerJSON();

    if (usuarios.find(u => u.correo === correo)) {
        throw new Error(JSON.stringify({ correo: "El correo ya está registrado" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(contrasena, salt);
    const hashedRespuesta = await bcrypt.hash(respuestaRecuperacion, salt);

    const nuevoUsuario = {
        nombre, Telefono, correo,
        password: hashedPass, // Contraseña encriptada
        pregunta: pregunta,
        respuestarc: hashedRespuesta, // Respuesta encriptada
        fechaRegistro: new Date()
    };

    usuarios.push(nuevoUsuario);
    await guardarUsuarios(usuarios);
    return { nombre: nuevoUsuario.nombre };
};

// --- LOGIN ---
export const procesarLogin = async (datos) => {
    const { correo, password } = datos;
    const usuarios = await leerJSON();
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) throw new Error("El usuario no existe");
    
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) throw new Error("Contraseña incorrecta");

    return { nombre: usuario.nombre, correo: usuario.correo };
};

// --- RECUPERACIÓN (Cambio de contraseña) ---
export const procesarCambioPassword = async (datos) => {
    const { correo, respuesta, nuevaPassword } = datos;
    const usuarios = await leerJSON();

    const index = usuarios.findIndex(u => u.correo === correo);
    if (index === -1) throw new Error("El correo no está registrado");

    // Validar palabra secreta contra la encriptada
    const esValida = await bcrypt.compare(respuesta, usuarios[index].respuestarc);
    if (!esValida) throw new Error("La palabra secreta es incorrecta");

    if (!nuevaPassword || nuevaPassword.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }

    // Encriptar la NUEVA contraseña
    const salt = await bcrypt.genSalt(10);
    usuarios[index].password = await bcrypt.hash(nuevaPassword, salt);

    await guardarUsuarios(usuarios);
    return { mensaje: "¡Contraseña actualizada con éxito!" };
};