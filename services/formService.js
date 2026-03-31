//logica de negocios
//guardar informacion
//aplicar reglas de negocio
//transformar datos
export const procesarFormulario = async (datos) => {
    const { nombre, Telefono, correo, contrasena, contrasenaConfirmacion, preguntaRecuperacion, respuestaRecuperacion } = datos;
    const errores = {};
 
    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
        errores.nombre = "El nombre solo debe contener letras";
    }
 
    if (!Telefono || !/^52\d{10}$/.test(Telefono)) {
        errores.Telefono = "Debe iniciar con 52 y tener 10 dígitos";
    }
 
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo inválido";
    }

    if (!contrasena || contrasena.length < 8) {
    errores.contrasena = "La contraseña debe tener al menos 8 caracteres";
}

if (contrasena !== contrasenaConfirmacion) {
    errores.contrasenaConfirmacion = "Las contraseñas no coinciden";
}

if (!preguntaRecuperacion || preguntaRecuperacion.length < 3) {
    errores.preguntaRecuperacion = "La pregunta debe tener al menos 3 caracteres";
}

if (!respuestaRecuperacion || respuestaRecuperacion.length < 3) {
    errores.respuestaRecuperacion = "La respuesta debe tener al menos 3 caracteres";
}

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }
 
    const datosProcesados = {
        nombre,
        Telefono,
        correo,
        contrasena,
        contrasenaConfirmacion,
        preguntaRecuperacion,
        respuestaRecuperacion,
        fecha: new Date()
    };
 
    /* aquí podrías guardar en DB */
 
    console.log("Procesado:", datosProcesados);
    return datosProcesados;
};