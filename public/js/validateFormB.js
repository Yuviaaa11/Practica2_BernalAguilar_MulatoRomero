const form = document.getElementById("miFormulario");
const resultado = document.getElementById("resultado");
const mensajeExito = document.getElementById("mensajeExito");

const campos = ["nombre","Telefono","correo","contrasena","contrasenaConfirmacion","preguntaRecuperacion","respuestaRecuperacion"];

const errores = {
  nombre: "errorNombre",
  Telefono: "errorTelefono",
  correo: "errorCorreo",
  contrasena: "errorContrasena",
  contrasenaConfirmacion: "errorContrasenaConfirmacion",
  preguntaRecuperacion: "errorPreguntaRecuperacion",
  respuestaRecuperacion: "errorRespuestaRecuperacion"
};

function validarCampo(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(errores[id]);

  if (!input || !error) return true;

  error.textContent = "";
  input.classList.remove("valido", "invalido");

  const valor = input.value.trim();

  if (input.required && valor === "") {
    error.textContent = "Este campo es obligatorio";
    input.classList.add("invalido");
    return false;
  }

  if (id === "nombre") {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(valor)) {
      error.textContent = "El nombre solo debe contener letras y mínimo 3 caracteres";
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

  if (id === "contrasena") {
    if (valor.length < 8) {
      error.textContent = "La contraseña debe tener al menos 8 caracteres";
      input.classList.add("invalido");
      return false;
    }
  }

  if (id === "contrasenaConfirmacion") {
    const contrasena = document.getElementById("contrasena");
    if (valor !== contrasena.value.trim()) {
      error.textContent = "Las contraseñas no coinciden";
      input.classList.add("invalido");
      return false;
    }
  }

  if (id === "preguntaRecuperacion") {
    if (valor.length < 3) {
      error.textContent = "La pregunta debe tener al menos 3 caracteres";
      input.classList.add("invalido");
      return false;
    }
  }

  if (id === "respuestaRecuperacion") {
    if (valor.length < 3) {
      error.textContent = "La respuesta debe tener al menos 3 caracteres";
      input.classList.add("invalido");
      return false;
    }
  }

  input.classList.add("valido");
  return true;
}

campos.forEach((id) => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener("blur", () => validarCampo(id));
  input.addEventListener("input", () => validarCampo(id));
});

function mostrarTarjetaExito() {
  document.getElementById("miFormulario").style.display = "none";
  document.getElementById("tarjetaExito").style.display = "flex";
}

function mostrarTarjetaError() {
  document.getElementById("tarjetaError").style.display = "flex";
}

function cerrarTarjetaError() {
  document.getElementById("tarjetaError").style.display = "none";
  document.getElementById("correo").value = "";
  document.getElementById("correo").classList.remove("valido");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let valido = true;

  if (mensajeExito) mensajeExito.textContent = "";
  if (resultado) resultado.textContent = "";

  campos.forEach((id) => {
    if (!validarCampo(id)) valido = false;
  });

  if (!valido) return;

  const datos = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch("/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultadoServidor = await response.json();

    if (response.ok) {
      mostrarTarjetaExito();
    } else {
      try {
        const erroresServidor = JSON.parse(resultadoServidor.mensaje);
        if (erroresServidor.correo === "El correo ya está registrado") { 
          mostrarTarjetaError();
        }
      } catch (e) {
        if (resultado) resultado.textContent = resultadoServidor.mensaje;
      }
    }

  } catch (error) {
    console.error("Error en fetch:", error);
    if (resultado) resultado.textContent = "Error al enviar el formulario";
  }
});