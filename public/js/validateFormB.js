const form = document.getElementById("miFormulario");
// Nota: 'resultado' y 'mensajeExito' se usan en el Registro
const resultado = document.getElementById("resultado");
const mensajeExito = document.getElementById("mensajeExito");

// Lista de campos para validación (se adaptan según el formulario)
const camposRegistro = ["nombre", "Telefono", "correo", "contrasena", "contrasenaConfirmacion", "pregunta", "respuestaRecuperacion"];
const camposLogin = ["correo", "password"];

// --- FUNCIÓN DE VALIDACIÓN VISUAL (La que pone todo en rojo) ---
function validarCampo(id) {
    const input = document.getElementById(id);
    if (!input) return true;

    // Buscamos el span de error. 
    // Si el id es 'password', busca 'errorPassword'. Si es 'correo', busca 'errorCorreo'.
    const errorId = "error" + id.charAt(0).toUpperCase() + id.slice(1);
    const errorSpan = document.getElementById(errorId);

    // Limpiamos estilos y textos previos (Esto quita las comas/puntos)
    input.classList.remove("invalido", "valido");
    if (errorSpan) errorSpan.textContent = "";

    const valor = input.value.trim();

    // 1. Validar si está vacío
    if (valor === "") {
        input.classList.add("invalido");
        if (errorSpan) errorSpan.textContent = "Este campo es obligatorio";
        return false;
    }

    // 2. Validaciones específicas por tipo
    if (id === "correo") {
        const regexCorreo = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!regexCorreo.test(valor)) {
            input.classList.add("invalido");
            if (errorSpan) errorSpan.textContent = "Correo electrónico inválido";
            return false;
        }
    }

    if (id === "Telefono" && !/^52\d{10}$/.test(valor)) {
        input.classList.add("invalido");
        if (errorSpan) errorSpan.textContent = "Debe iniciar con 52 y tener 10 dígitos";
        return false;
    }

    if (id === "contrasena" && valor.length < 8) {
        input.classList.add("invalido");
        if (errorSpan) errorSpan.textContent = "Mínimo 8 caracteres";
        return false;
    }

    if (id === "contrasenaConfirmacion") {
        const passOriginal = document.getElementById("contrasena").value;
        if (valor !== passOriginal) {
            input.classList.add("invalido");
            if (errorSpan) errorSpan.textContent = "Las contraseñas no coinciden";
            return false;
        }
    }

    // Si todo está bien
    input.classList.add("valido");
    return true;
}

// --- EVENTOS PARA VALIDAR MIENTRAS ESCRIBES ---
document.querySelectorAll("input, select").forEach(elemento => {
    elemento.addEventListener("blur", () => validarCampo(elemento.id));
    elemento.addEventListener("input", () => validarCampo(elemento.id));
});

// --- FUNCIONES PARA TARJETAS DE REGISTRO ---
function mostrarTarjetaExito() {
    form.style.display = "none";
    document.getElementById("tarjetaExito").style.display = "flex";
}

function mostrarTarjetaError() {
    document.getElementById("tarjetaError").style.display = "flex";
}

// Global para que el botón cerrar funcione
window.cerrarTarjetaError = function() {
    document.getElementById("tarjetaError").style.display = "none";
    const correoInput = document.getElementById("correo");
    if (correoInput) {
        correoInput.value = "";
        correoInput.classList.remove("valido");
        correoInput.focus();
    }
};

// --- EL EVENTO SUBMIT (EL CEREBRO) ---
form.addEventListener("submit", async function (e) {
    e.preventDefault(); 

    // Detectar si es Registro, Login (Kirby) o Recuperación
    const esRegistro = document.getElementById("nombre") !== null;
    const esRecuperacion = document.getElementById("nuevaPassword") !== null;

    // --- CASO 1: LOGIN (KIRBY / InForm.html) ---
    if (!esRegistro && !esRecuperacion) {
        const v1 = validarCampo("correo");
        const v2 = validarCampo("password");

        if (!v1 || !v2) return; // Si hay rojo, no avanza

        const datos = {
            correo: document.getElementById("correo").value.trim(),
            password: document.getElementById("password").value.trim()
        };

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            const res = await response.json();

            if (response.ok) {
                window.location.href = "/inicio"; // Te lleva con Mitsuri
            } else {
                alert(res.mensaje);
            }
        } catch (err) { alert("Error de conexión"); }
        return;
    }

    // --- CASO 2: REGISTRO (FormularioCrear.html) ---
    if (esRegistro) {
        let valido = true;
        camposRegistro.forEach(id => {
            if (!validarCampo(id)) valido = false;
        });

        if (!valido) return;

        const datosRegistro = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch("/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosRegistro)
            });
            const res = await response.json();

            if (response.ok) {
                mostrarTarjetaExito();
            } else {
                // Si el correo ya existe, muestra la tarjeta de error de Yuvia
                if (res.mensaje.includes("ya está registrado")) {
                    mostrarTarjetaError();
                } else {
                    alert(res.mensaje);
                }
            }
        } catch (err) { alert("Error al registrar"); }
        return;
    }

    // --- CASO 3: RECUPERACIÓN (Conform.html) ---
    if (esRecuperacion) {
        // Aquí puedes agregar validaciones similares para recuperación si lo deseas
        const datosRec = Object.fromEntries(new FormData(form));
        try {
            const response = await fetch("/recuperar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosRec)
            });
            const res = await response.json();
            alert(res.mensaje);
            if (response.ok) window.location.href = "/";
        } catch (err) { alert("Error en la recuperación"); }
    }
});