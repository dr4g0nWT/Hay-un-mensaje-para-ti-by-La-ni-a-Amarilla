// --- LÓGICA DE PESTAÑAS ---
function openTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- LÓGICA DE FILTRADO ---
function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const activeTab = document.querySelector('.tab-content.active');
    const table = activeTab.querySelector('table');

    if (!table) return;

    const tr = table.getElementsByTagName('tr');
    for (let i = 1; i < tr.length; i++) {
        const rowContent = tr[i].innerText.toLowerCase(); // Check strict innerText for row
        if (rowContent.includes(filter)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

// --- LOGICA GLOBAL DEL DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const modal = document.getElementById('composeModal');
    const btn = document.getElementById('composeBtn');
    const span = document.getElementById('closeModalBtn');
    const form = document.getElementById('composeForm');

    // Botón flotante abre modal para ESCRIBIR (limpio)
    if (btn) {
        btn.onclick = function () {
            resetModalForNewMessage();
            modal.style.display = "flex";
        }
    }

    // Botón cerrar (Guardar borrador si toca)
    if (span) {
        span.onclick = function () {
            closeAndSaveDraft();
        }
    }

    // Click fuera
    window.onclick = function (event) {
        if (event.target == modal) {
            closeAndSaveDraft();
        }
        // Cerrar también el common modal si click fuera? 
        // No, el common modal suele ser modal-force. Dejo asi.
    }

    // Submit
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();
            sendMessage();
        }
    }
});

// --- FUNCIONES ACCIONES MENSAJES ---

// 1. ABRIR MENSAJE (Lectura o Edición)
function openMessage(msg, mode) {
    const modal = document.getElementById('composeModal');
    const form = document.getElementById('composeForm');
    const recipientInput = document.getElementById('recipient');
    const subjectInput = document.getElementById('subject');
    const contentInput = document.getElementById('messageContent');
    const dateGroup = document.getElementById('dateGroup');
    const messageDate = document.getElementById('messageDate');
    const modalTitle = document.getElementById('modalTitle');
    const sendBtn = document.getElementById('sendBtn');
    const draftStatus = document.getElementById('draftStatus');
    const messageId = document.getElementById('messageId');

    // Rellenamos datos
    messageId.value = msg.id;
    subjectInput.value = msg.subject;
    contentInput.value = msg.content;

    // Si es modo lectura (recibido)
    if (mode === 'read') {
        modalTitle.innerText = "Lectura de mensaje";
        recipientInput.value = msg.sender_name || 'Desconocido';
        recipientInput.previousElementSibling.innerText = "De:"; // Cambiar Label

        // Bloquear campos
        recipientInput.readOnly = true;
        subjectInput.readOnly = true;
        contentInput.readOnly = true;

        // Mostrar fecha
        dateGroup.style.display = 'block';
        messageDate.value = new Date(msg.created_at).toLocaleString();

        // Ocultar botón enviar
        sendBtn.style.display = 'none';
        draftStatus.innerText = "";
    }
    // Si es modo edición (borrador)
    else if (mode === 'edit') {
        modalTitle.innerText = "Editar Borrador";
        recipientInput.value = msg.receiver_name || '';
        recipientInput.previousElementSibling.innerText = "Para:"; // Restaurar Label

        // Desbloquear
        recipientInput.readOnly = false;
        subjectInput.readOnly = false;
        contentInput.readOnly = false;

        // Ocultar fecha
        dateGroup.style.display = 'none';

        // Mostrar botón
        sendBtn.style.display = 'block';
        sendBtn.innerText = "Enviar ✉️";
        draftStatus.innerText = "Guardado anteriormente en borrador";
    }

    modal.style.display = "flex";
}

function resetModalForNewMessage() {
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('composeForm');
    const recipientInput = document.getElementById('recipient');
    const subjectInput = document.getElementById('subject');
    const contentInput = document.getElementById('messageContent');
    const dateGroup = document.getElementById('dateGroup');
    const sendBtn = document.getElementById('sendBtn');
    const draftStatus = document.getElementById('draftStatus');
    const messageId = document.getElementById('messageId');

    form.reset();
    messageId.value = ''; // Reset ID = Nuevo mensaje

    modalTitle.innerText = "Nuevo Mensaje";
    recipientInput.previousElementSibling.innerText = "Para:";
    recipientInput.readOnly = false;
    subjectInput.readOnly = false;
    contentInput.readOnly = false;

    dateGroup.style.display = 'none';
    sendBtn.style.display = 'block';
    sendBtn.innerText = "Enviar ✉️";
    draftStatus.innerText = "";
}

// 2. CERRAR Y GUARDAR BORRADOR (Solo si es nuevo o estaba editando borrador)
function closeAndSaveDraft() {
    const modal = document.getElementById('composeModal');
    // Si el botón enviar está oculto, es modo lectura. No guardar nada.
    const sendBtn = document.getElementById('sendBtn');

    if (sendBtn.style.display === 'none') {
        modal.style.display = 'none';
        return;
    }

    modal.style.display = "none";

    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('messageContent').value;
    const id = document.getElementById('messageId').value;

    // Solo guardar si hay algo escrito
    if (recipient || subject || content) {
        saveMessageToBackend(id, recipient, subject, content, 'draft');
    }
}

// 3. ENVIAR
function sendMessage() {
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('messageContent').value;
    const id = document.getElementById('messageId').value; // Puede estar vacío si es nuevo

    saveMessageToBackend(id, recipient, subject, content, 'sent');
}

// 4. BACKEND SAVE (Create or Update)
function saveMessageToBackend(id, recipient, subject, content, status) {
    const draftStatus = document.getElementById('draftStatus');
    if (status === 'draft' && draftStatus) draftStatus.innerText = "Guardando...";

    const payload = { id, recipient, subject, content, status };

    fetch('/messages/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(data => {
            if (status === 'sent') {
                if (data.success) {
                    CommonModal.show('success', '¡Mensaje Enviado!', data.message, () => {
                        location.reload();
                    });
                    document.getElementById('composeModal').style.display = "none";
                    document.getElementById('composeForm').reset();
                } else {
                    CommonModal.show('error', 'Error al enviar', data.message);
                }
            } else {
                // Draft saved
                if (draftStatus) draftStatus.innerText = "Borrador guardado";
                // Si era nuevo, ahora ya tiene ID (idealmente el back debería devolverlo para futuros updates sin recargar)
                // Pero como cerramos el modal, no pasa nada. Si abrimos de nuevo desde borrador, ya tendrá ID.
            }
        })
        .catch(e => console.error(e));
}

// 5. TOGGLE FAVORITE
function toggleFavorite(id, btnElement) {
    fetch('/messages/toggle-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                // Cambiar icono visualmente sin recargar toda la página si se quiere, 
                // O recargar para mover de pestaña. Lo más simple: cambiar clase.
                const isFav = btnElement.classList.contains('active');
                if (isFav) {
                    btnElement.classList.remove('active');
                    btnElement.innerText = '☆';
                } else {
                    btnElement.classList.add('active');
                    btnElement.innerText = '⭐';
                }
            }
        })
        .catch(e => console.error(e));
}

// 6. CONFIRM DELETE
function confirmDelete(id) {
    CommonModal.show('warning', '¿Eliminar Mensaje?', '¿Seguro que quieres borrar este mensaje? Esta acción no se puede deshacer.', () => {
        // Al confirmar
        fetch('/messages/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    CommonModal.show('success', 'Eliminado', 'El mensaje ha sido eliminado.', () => {
                        location.reload();
                    });
                } else {
                    CommonModal.show('error', 'Error', 'No se pudo eliminar el mensaje');
                }
            })
    }, true); // showCancel = true
}