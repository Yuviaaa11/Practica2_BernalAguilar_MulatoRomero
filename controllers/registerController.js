/**
 * REGSITRERCONTROLLER UNIFICADO
 * Maneja tanto el registro de nuevos usuarios como el inicio de sesión.
 */

// 1. Lógica para Registrar un Usuario Nuevo
exports.registrarUsuario = (req, res) => {
    const { 
        nombre, 
        Telefono, 
        correo, 
        contrasena, 
        contrasenaConfirmacion, 
        preguntaRecuperacion, 
        respuestaRecuperacion 
    } = req.body;

    // Validaciones: Verifica que no falte ningún campo del formulario de registro
    if (!nombre || !Telefono || !correo || !contrasena || !contrasenaConfirmacion || !preguntaRecuperacion || !respuestaRecuperacion) {
        return res.status(400).json({
            valido: false,
            mensaje: "Todos los campos son obligatorios para el registro"
        });
    }

    // Validación extra: Que las contraseñas coincidan
    if (contrasena !== contrasenaConfirmacion) {
        return res.status(400).json({
            valido: false,
            mensaje: "Las contraseñas no coinciden"
        });
    }

    // Objeto de usuario para simulación de guardado
    const nuevoUsuario = {
        nombre,
        Telefono,
        correo, 
        contrasena, 
        preguntaRecuperacion, 
        respuestaRecuperacion
    };

    console.log("Nuevo usuario registrado:", nuevoUsuario);

    res.status(200).json({
        ok: true,
        mensaje: "Usuario registrado correctamente",
        data: nuevoUsuario
    });
};

// 2. Lógica para Inicio de Sesión (Login)
exports.loginUsuario = (req, res) => {
    const { correo, password } = req.body;

    // Validación de campos mínimos para entrar
    if (!correo || !password) {
        return res.status(400).json({
            valido: false,
            mensaje: "Faltan datos (correo o contraseña)"
        });
    }

    console.log("Intento de login para:", correo);

    // Respuesta de éxito simulada
    res.status(200).json({
        ok: true,
        mensaje: "¡Bienvenido!",
        usuario: correo,
        status: "Sesión iniciada correctamente"
    });
};