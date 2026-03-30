/**
 * VALIDACIÓN DE FORMULARIOS UNIFICADA
 */

const forms = document.querySelectorAll("form"); // Selecciona todos los formularios
const resultado = document.getElementById("resultado");
const mensajeExito = document.getElementById("mensajeExito");

// Mapeo unificado de errores
const erroresMap = {
    nombre: "errorNombre",
    Telefono: "errorTelefono",
    correo: "errorCorreo",
    contrasena: "errorContrasena",
    password: "error-password", // Del segundo formulario
    contrasenaConfirmacion: "errorContrasenaConfirmacion",
    preguntaRecuperacion: "errorPreguntaRecuperacion",
    respuestaRecuperacion: "errorRespuestaRecuperacion"
};

function validarCampo(id) {
    const input = document.getElementById(id);
    // Intenta buscar el error por el mapa o por el ID dinámico "error-id"
    const errorId = erroresMap[id] || `error-${id}`;
    const error = document.getElementById(errorId);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");
    const valor = input.value.trim();

    // 1. Validación de campo obligatorio
    if (input.required && (valor === "" || input.validity.valueMissing)) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    // 2. Validaciones específicas por ID
    if (id === "nombre") {
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(valor)) {
            error.textContent = "El nombre debe tener letras y mínimo 3 caracteres";
            input.classList.add("invalido");
            return false;
        }
    }

    if (id === "Telefono") {
        if (!/^52\d{10}$/.test(valor)) {
            error.textContent = "Debe iniciar con 52 y tener 10 dígitos";
            input.classList.add("invalido");
            return false;
        }
    }

    if (id === "correo") {
        if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(valor)) {
            error.textContent = "Correo electrónico inválido";
            input.classList.add("invalido");
            return false;
        }
    }

    if ((id === "contrasena" || id === "password") && valor.length < 8) {
        error.textContent = "La contraseña debe tener al menos 8 caracteres";
        input.classList.add("invalido");
        return false;
    }

    if (id === "contrasenaConfirmacion") {
        const original = document.getElementById("contrasena");
        if (valor !== original.value.trim()) {
            error.textContent = "Las contraseñas no coinciden";
            input.classList.add("invalido");
            return false;
        }
    }

    input.classList.add("valido");
    return true;
}

// Escuchar eventos en todos los formularios de la página
forms.forEach(form => {
    // Agregar validación en tiempo real a los inputs de este formulario
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        if (input.id) {
            input.addEventListener("blur", () => validarCampo(input.id));
            input.addEventListener("input", () => validarCampo(input.id));
        }
    });

    // Manejo del Submit
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        let esValido = true;

        // Validar solo los campos que pertenecen a este formulario
        const camposDelForm = form.querySelectorAll("input");
        camposDelForm.forEach(input => {
            if (input.id && !validarCampo(input.id)) {
                esValido = false;
            }
        });

        if (!esValido) return;

        const datos = Object.fromEntries(new FormData(form));
        
        // Determinar a qué endpoint enviar (si es login/recuperar o registro)
        const endpoint = form.id === "formRecuperar" ? "/recuperar" : (form.id === "formRegistro" ? "/registro" : "/");

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const serverRes = await response.json();

            if (serverRes.ok) {
                // Caso de éxito
                if (mensajeExito) mensajeExito.textContent = "¡Operación exitosa!";
                
                if (endpoint === "/registro") {
                    document.body.innerHTML = `<h1>${serverRes.mensaje || '¡Bienvenido!'}</h1>`;
                } else {
                    resultado.textContent = serverRes.detalles || serverRes.mensaje;
                    resultado.style.color = "#27ae60";
                }
            } else {
                // Caso de error del servidor
                alert(serverRes.mensaje);
                if (resultado) {
                    resultado.textContent = serverRes.mensaje;
                    resultado.style.color = "#e74c3c";
                }
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            if (resultado) resultado.textContent = "Error de conexión con el servidor";
        }
    });
});