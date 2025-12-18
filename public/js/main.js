document.addEventListener('DOMContentLoaded', () => {
    const btnOpen = document.getElementById('btnOpen');
    const overlay = document.getElementById('secretMessageOverlay');

    // Función para ABRIR el mensaje
    if (btnOpen && overlay) {
        btnOpen.addEventListener('click', () => {
            overlay.classList.remove('hidden');
            // Timeout para permitir que el navegador renderice antes de la transición
            setTimeout(() => {
                overlay.classList.add('visible');
            }, 10);
        });
    }
});

// Función para CERRAR el mensaje (se llama desde el HTML onclick="")
function cerrarMensaje() {
    const overlay = document.getElementById('secretMessageOverlay');
    if (overlay) {
        overlay.classList.remove('visible');
        // Esperamos a que termine la transición de opacidad (0.4s) para ocultarlo
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 400);
    }
}