document.addEventListener('DOMContentLoaded', () => {
    const formRecuperar = document.getElementById('formRecuperar');

    if (formRecuperar) {
        formRecuperar.addEventListener('submit', async (e) => {
            e.preventDefault(); // Esto detiene el envío por URL

            const formData = new FormData(formRecuperar);
            const datos = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/recuperar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (resultado.ok) {
                    alert(resultado.mensaje);
                    window.location.href = "/"; // Te regresa al login
                } else {
                    alert("Error: " + resultado.mensaje);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema al conectar con el servidor.");
            }
        });
    }
});