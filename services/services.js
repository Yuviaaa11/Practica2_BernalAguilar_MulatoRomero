import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('./src/data/usuarios.json');

// Rutinas de lectura y escritura
const leerJSON = async () => {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
};

const escribirAlFinalJSON = async (nuevoUsuario) => {
    const usuarios = await leerJSON();
    usuarios.push(nuevoUsuario);
    await fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2));
};

export const procesarFormulario = async (datos) => {
    const { password, correo } = datos;
    const usuarios = await leerJSON();

    const usuarioEncontrado = usuarios.find(u => u.correo === correo);

    if (!usuarioEncontrado) {
        throw new Error("El usuario no existe"); // Esto disparará el alert en el front
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

export const procesarRecuperacion = async (datos) => {
    const { correo, respuesta } = datos;
    const usuarios = await leerJSON();
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) throw new Error("Correo no registrado");

    // Validar palabra secreta (respuestarc)
    const respuestaValida = await bcrypt.compare(respuesta, usuario.respuestarc);

    if (!respuestaValida) throw new Error("La palabra secreta es incorrecta");

    return {
        mensaje: "Identidad verificada",
        instrucciones: "Ahora puedes restablecer tu contraseña."
    };

        const errores = {};
    console.log("Datos recibidos en backend:", datos);

    if (!password || password.length < 3) {
        errores.password = "La contraseña debe tener al menos 3 caracteres";
    }

     if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo inválido";
    }

    if (!respuesta || respuesta.length < 2) {
        errores.respuesta = "La palabra secreta es demasiado corta";
    };

};


