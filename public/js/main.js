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

document.addEventListener('DOMContentLoaded', () => {

    /* --- CÓDIGO EXISTENTE DEL BOTÓN ABRIR --- */
    // ... (Tu código del botón abrir y cerrar overlay sigue aquí igual) ...


    /* --- NUEVO: CAMBIO DE COLOR DEL HEADER AL SCROLEAR --- */
    const header = document.getElementById('mainHeader');
    const sections = document.querySelectorAll('.snap-section');

    // Configuración del observador
    const observerOptions = {
        root: null, // viewport
        threshold: 0.5 // Se activa cuando el 50% de la sección es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Leemos el atributo data-header-theme de la sección actual
                const theme = entry.target.getAttribute('data-header-theme');

                if (theme === 'dark') {
                    // Si el fondo es claro, ponemos header oscuro
                    header.classList.add('header-dark');
                } else {
                    // Si el fondo es oscuro, quitamos la clase (vuelve a blanco)
                    header.classList.remove('header-dark');
                }
            }
        });
    }, observerOptions);

    // Activamos el observador en todas las secciones
    sections.forEach(section => {
        observer.observe(section);
    });

});

/* --- MENÚ DESPLEGABLE --- */
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('active');
}

// Cerrar el menú si hacemos click fuera de él
document.addEventListener('click', (event) => {
    const menu = document.getElementById('dropdownMenu');
    const icon = document.getElementById('menuIcon');

    // Si el click NO fue en el menú NI en el icono, y el menú está abierto -> ciérralo
    if (!menu.contains(event.target) && !icon.contains(event.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});