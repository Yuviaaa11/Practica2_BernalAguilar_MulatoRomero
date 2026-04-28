import bcrypt from 'bcryptjs';
import { 
    writeUser, 
    findUserByEmail, 
    existsUser, 
    updatePassword 
} from '../models/models.js';

// --- REGISTRO ---
export const registrarUsuariioService = async (datos) => {
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

    const usuario = await findUserByEmail(correo);
    if (!usuario) throw new Error("El correo no está registrado");

    const esValida = await bcrypt.compare(respuesta, usuario.respuestarc);
    if (!esValida) throw new Error("La palabra secreta es incorrecta");

    if (!nuevaPassword || nuevaPassword.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(nuevaPassword, salt);

    await updatePassword(correo, hashedPass);

    return { mensaje: "¡Contraseña actualizada con éxito!" };
};