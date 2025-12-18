document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnOpen');
    const message = document.getElementById('secretMessage');

    if (btn) {
        btn.addEventListener('click', () => {
            // 1. Ocultar botón y hacerlo no clicable
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';

            // Esperamos la transición del botón para quitarlo del flujo (opcional)
            setTimeout(() => {
                btn.style.display = 'none';
            }, 300);

            // 2. Mostrar mensaje
            message.style.display = 'block';

            // Pequeño retardo para activar la transición de opacidad CSS
            setTimeout(() => {
                message.classList.add('visible'); // Usaremos una clase CSS para esto
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, 50);
        });
    }
});