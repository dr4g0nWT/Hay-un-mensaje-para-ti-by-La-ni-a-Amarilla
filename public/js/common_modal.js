
const CommonModal = {
    modal: null,
    title: null,
    message: null,
    icon: null,
    footer: null,
    header: null,

    init: function () {
        this.modal = document.getElementById('commonModal');
        this.title = document.getElementById('commonModalTitle');
        this.message = document.getElementById('commonModalMessage');
        this.icon = document.getElementById('commonModalIcon');
        this.footer = document.getElementById('commonModalFooter');
        this.header = document.getElementById('commonModalHeader');
    },

    /**
     * Shows a modal
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} title 
     * @param {string} message 
     * @param {function} onConfirm - Callback for 'Yes'/'OK'
     * @param {boolean} showCancel - Show Cancel button?
     */
    show: function (type, title, message, onConfirm = null, showCancel = false) {
        if (!this.modal) this.init();

        this.title.innerText = title;
        this.message.innerText = message;
        this.footer.innerHTML = '';
        this.modal.className = 'modal-overlay'; // Reset classes
        this.modal.classList.add('modal-type-' + type);

        // Icon & Header Style
        let iconEmoji = '';
        let headerColorClass = '';

        switch (type) {
            case 'success': iconEmoji = '✅'; headerColorClass = 'modal-type-success'; break;
            case 'error': iconEmoji = '❌'; headerColorClass = 'modal-type-error'; break;
            case 'warning': iconEmoji = '⚠️'; headerColorClass = 'modal-type-warning'; break;
            default: iconEmoji = 'ℹ️';
        }
        this.icon.innerText = iconEmoji;

        // Reset header class
        this.header.className = 'modal-header common-header ' + headerColorClass;

        // Buttons
        const confirmBtn = document.createElement('button');
        confirmBtn.className = type === 'warning' && showCancel ? 'common-btn btn-danger' : 'common-btn btn-primary';
        confirmBtn.innerText = showCancel ? 'Sí, continuar' : 'Aceptar';

        confirmBtn.onclick = () => {
            this.close();
            if (onConfirm) onConfirm();
        };

        if (showCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'common-btn btn-secondary';
            cancelBtn.innerText = 'Cancelar';
            cancelBtn.onclick = () => this.close();
            this.footer.appendChild(cancelBtn);
        }

        this.footer.appendChild(confirmBtn);

        this.modal.style.display = 'flex';
    },

    close: function () {
        if (this.modal) this.modal.style.display = 'none';
    }
};

function closeCommonModal() {
    CommonModal.close();
}
