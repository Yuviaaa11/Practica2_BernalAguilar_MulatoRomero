const form = document.getElementById("miFormulario", "formRecuperar");
const resultado = document.getElementById("resultado");
const campos = ["password","correo"];
 
function validarCampo(id){
    const input = document.getElementById(id);
    const error = document.getElementById("error-"+id);
 
    if(!input || !error) return true;
 
    error.textContent = "";
    input.classList.remove("valido","invalido");

    /* campo obligatorio */
    if(input.required && input.validity.valueMissing){
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }
 
    if (id === "password" && input.value.length < 3) {
    error.textContent = "La contraseña debe tener al menos 3 caracteres";
    input.classList.add("invalido");
    return false;
    }   
     
    /* email */
    if(input.validity.typeMismatch){
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }
 
    input.classList.add("valido");
    return true;
}
 
/* eventos en inputs */
campos.forEach(id => {
    const input = document.getElementById(id);
 
    if(!input) return;
 
    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => validarCampo(id));
 
});
 
/* submit */
form.addEventListener("submit", async function(e) {
    let valido = true;
      e.preventDefault();
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });
 
    if (!valido) {
           return;
    }
    

    // crear objeto JS a partir de un FormData
    /*
      {
        atr1:valor,
        atr2:valor,
        ...
        atrn:valor
      }
    */
    const datos = Object.fromEntries(new FormData(form));

    
 //que hacee fetch, AXIOS
    const response = await fetch("/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
    });
 
    const resultadoServidor = await response.json();
 
    resultado.textContent = JSON.stringify(resultadoServidor, null, 2);
 
 form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const datos = Object.fromEntries(new FormData(form));

    const response = await fetch("/recuperar", { // Asegúrate que esta ruta exista en tu servidor
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const serverRes = await response.json();

    if (serverRes.ok) {
        resultado.textContent = serverRes.detalles;
        resultado.style.color = "#27ae60";
    } else {
        resultado.textContent = "Error: " + serverRes.mensaje;
        resultado.style.color = "#e74c3c";
    }
});
 
    /*
    localStorage.setItem("formDatos", JSON.stringify(datos));
 
    const datosGuardados = JSON.parse(localStorage.getItem("formDatos"));
    console.log(datosGuardados);
    */
});