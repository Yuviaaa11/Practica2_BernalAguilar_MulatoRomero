exports.registrarUsuario = (req, res) => {

    const { nombre, Telefono, correo, contrasena, contrasenaConfirmacion, preguntaRecuperacion, respuestaRecuperacion } = req.body;

    // Validaciones básicas
    if (!nombre || !Telefono || !correo || !contrasena || !contrasenaConfirmacion||!preguntaRecuperacion||!respuestaRecuperacion) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    // Simulación de guardado
    const usuario = {
        nombre,
        Telefono,
        correo, 
        contrasena, 
        contrasenaConfirmacion,
        preguntaRecuperacion, 
        respuestaRecuperacion
    };

    console.log("Datos recibidos:", usuario);

    res.status(200).json({
        mensaje: "Usuario registrado correctamente",
        data: usuario
    });
};