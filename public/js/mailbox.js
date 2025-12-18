// --- LÓGICA DE PESTAÑAS ---
function openTab(tabName) {
    // 1. Ocultar todos los contenidos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. Desactivar todos los botones
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Mostrar el seleccionado
    document.getElementById(tabName).classList.add('active');

    // 4. Activar el botón correspondiente (truco: buscamos por texto o índice, 
    // pero para simplificar, añadimos la clase al botón clickeado)
    event.currentTarget.classList.add('active');
}

// --- LÓGICA DE FILTRADO (Buscador) ---
function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();

    // Filtramos solo la tabla visible
    const activeTab = document.querySelector('.tab-content.active');
    const table = activeTab.querySelector('table');

    if (!table) return; // Si no hay tabla (ej. vista vacía), salir

    const tr = table.getElementsByTagName('tr');

    // Empezamos en 1 para saltar el Header
    for (let i = 1; i < tr.length; i++) {
        const rowContent = tr[i].textContent.toLowerCase();
        if (rowContent.includes(filter)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}