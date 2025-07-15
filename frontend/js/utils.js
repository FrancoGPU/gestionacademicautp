// Utilidades generales
class Utils {
    // Formatear fecha
    static formatDate(date) {
        if (!date) return '-';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('es-ES', options);
    }

    // Formatear fecha solo día
    static formatDateOnly(date) {
        if (!date) return '-';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('es-ES', options);
    }

    // Capitalizar primera letra
    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mostrar loading
    static showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    // Ocultar loading
    static hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Mostrar notificación
    static showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar estilos si no existen
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    min-width: 300px;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    animation: slideInRight 0.3s ease;
                }
                .notification-info {
                    background-color: #3b82f6;
                    color: white;
                }
                .notification-success {
                    background-color: #10b981;
                    color: white;
                }
                .notification-warning {
                    background-color: #f59e0b;
                    color: white;
                }
                .notification-error {
                    background-color: #ef4444;
                    color: white;
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                }
                .notification-close:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Agregar al DOM
        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Confirmar acción
    static async confirmAction(message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h3>Confirmar Acción</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <div class="form-actions" style="margin-top: 1.5rem;">
                            <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); window.confirmResolve(false);">
                                ${cancelText}
                            </button>
                            <button class="btn btn-error" onclick="this.closest('.modal').remove(); window.confirmResolve(true);">
                                ${confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            window.confirmResolve = resolve;

            // Cerrar con ESC
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', handleKeyDown);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleKeyDown);
        });
    }

    // Generar ID único
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Debounce para búsquedas
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Filtrar tabla
    static filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    // Ordenar tabla
    static sortTable(tableId, columnIndex, ascending = true) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();

            // Intentar comparar como números
            const aNum = parseFloat(aText);
            const bNum = parseFloat(bText);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return ascending ? aNum - bNum : bNum - aNum;
            }

            // Comparar como texto
            return ascending ? 
                aText.localeCompare(bText) : 
                bText.localeCompare(aText);
        });

        // Reordenar en el DOM
        rows.forEach(row => tbody.appendChild(row));
    }

    // Exportar datos a CSV
    static exportToCSV(data, filename) {
        const csv = this.arrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Convertir array a CSV
    static arrayToCSV(data) {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escapar comillas y envolver en comillas si contiene comas
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        return csvContent;
    }

    // Validar formulario
    static validateForm(formElement) {
        const errors = [];
        const inputs = formElement.querySelectorAll('[required]');

        inputs.forEach(input => {
            const value = input.value.trim();
            const label = input.previousElementSibling?.textContent || input.name || 'Campo';

            if (!value) {
                errors.push(`${label} es requerido`);
                input.classList.add('error');
            } else {
                input.classList.remove('error');

                // Validaciones específicas
                if (input.type === 'email' && !this.isValidEmail(value)) {
                    errors.push(`${label} debe ser un email válido`);
                    input.classList.add('error');
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Limpiar formulario
    static clearForm(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.classList.remove('error');
        });
    }

    // Llenar formulario con datos
    static fillForm(formElement, data) {
        Object.keys(data).forEach(key => {
            const input = formElement.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = data[key];
                } else if (input.type === 'radio') {
                    const radio = formElement.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = data[key] || '';
                }
            }
        });
    }

    // Obtener datos del formulario
    static getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};

        for (let [key, value] of formData.entries()) {
            // Manejar checkboxes múltiples
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Agregar checkboxes no marcados
        const checkboxes = formElement.querySelectorAll('input[type="checkbox"]:not(:checked)');
        checkboxes.forEach(checkbox => {
            if (!data.hasOwnProperty(checkbox.name)) {
                data[checkbox.name] = false;
            }
        });

        return data;
    }

    // Funciones de Modal global
    static openModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    static closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Configurar eventos de modal global
    static setupModalEvents() {
        const modal = document.getElementById('modal');
        if (modal) {
            // Cerrar modal con click fuera del contenido
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Utils.closeModal();
                }
            });

            // Cerrar modal con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    Utils.closeModal();
                }
            });
        }
    }
}

// Agregar estilos de error para formularios
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(errorStyles);

// Exportar Utils globalmente
window.Utils = Utils;

// Configurar función global de modal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Utils.setupModalEvents();
});

// Función global para cerrar modal
window.closeModal = () => {
    Utils.closeModal();
};
