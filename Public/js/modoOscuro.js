function aplicarModoGuardado() {
    const activo = localStorage.getItem("modoOscuro") === "true";
    document.body.classList.toggle("oscuro", activo);
    document.getElementById("btnModoOscuro").textContent = activo ? "Modo claro" : "Modo oscuro";
}

function toggleModoOscuro() {
    const activo = document.body.classList.toggle("oscuro");
    localStorage.setItem("modoOscuro", activo);
    document.getElementById("btnModoOscuro").textContent = activo ? "Modo claro" : "Modo oscuro";
}

document.addEventListener("DOMContentLoaded", aplicarModoGuardado);