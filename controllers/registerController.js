exports.registrarUsuario = (req, res) => {

    const { password, correo } = req.body;

    if (!password || !correo) {
        return res.status(400).json({
            valido: false,
            mensaje: "Faltan datos"
        });
    }

    // Simulamos que el usuario ya existe
    console.log("Intento de login:", correo);

    res.status(200).json({
        mensaje: "¡Bienvenido!",
        usuario: correo,
        status: "Sesión iniciada correctamente"
    });
};