// Manejo de Proyectos
class ProyectosManager {
    constructor() {
        this.proyectos = [];
        this.filteredProyectos = [];
        this.currentProyecto = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });

        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'proyectos') {
                this.loadTable();
            }
        });
    }

    setupEventListeners() {
        this.setupSearch();
        this.setupTableSorting();
    }

    async loadTable() {
        try {
            Utils.showLoading();
            const data = await API.proyectos.getAll();
            this.proyectos = data;
            this.filteredProyectos = [...data];
            this.renderTable();
            Utils.hideLoading();
        } catch (error) {
            console.error('Error loading proyectos:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al cargar los proyectos', 'error');
        }
    }

    renderTable() {
        const tbody = document.querySelector('#proyectosTable tbody');
        if (!tbody) return;

        if (this.filteredProyectos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No se encontraron proyectos</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredProyectos.map(proyecto => `
            <tr>
                <td>${proyecto.id}</td>
                <td>${proyecto.titulo}</td>
                <td class="descripcion-cell" title="${proyecto.resumen || 'Sin resumen'}">
                    ${proyecto.resumen && proyecto.resumen.length > 50 ? 
                        proyecto.resumen.substring(0, 50) + '...' : 
                        proyecto.resumen || 'Sin resumen'}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="proyectos.viewProyecto('${proyecto.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="proyectos.editProyecto('${proyecto.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="proyectos.deleteProyecto('${proyecto.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusClass(estado) {
        const statusMap = {
            'En Desarrollo': 'status-pending',
            'Completado': 'status-active',
            'Pendiente': 'status-inactive',
            'Cancelado': 'status-inactive'
        };
        return statusMap[estado] || 'status-inactive';
    }

    setupSearch() {
        const proyectosSection = document.getElementById('proyectos');
        const sectionHeader = proyectosSection.querySelector('.section-header');
        
        let searchContainer = proyectosSection.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-bar">
                    <input type="text" id="proyectosSearch" placeholder="Buscar proyectos..." class="form-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
            `;
            sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
            
            // Agregar estilos CSS
            this.addSearchStyles();
        }

        const searchInput = document.getElementById('proyectosSearch');

        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => this.filterProyectos(), 300));
        }
    }

    addSearchStyles() {
        if (document.getElementById('proyectos-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'proyectos-search-styles';
        styles.textContent = `
            .search-container {
                margin: 1.5rem 0;
            }
            
            .search-bar {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .search-bar input {
                padding-right: 3rem;
            }
            
            .search-icon {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-secondary);
            }
            
            .search-filters {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .search-filters select,
            .search-filters input {
                min-width: 150px;
            }
        `;
        document.head.appendChild(styles);
    }

    filterProyectos() {
        const searchTerm = document.getElementById('proyectosSearch')?.value.toLowerCase() || '';

        this.filteredProyectos = this.proyectos.filter(proyecto => {
            const matchesSearch = !searchTerm || 
                proyecto.titulo.toLowerCase().includes(searchTerm) ||
                (proyecto.resumen && proyecto.resumen.toLowerCase().includes(searchTerm));

            return matchesSearch;
        });

        this.renderTable();
    }

    setupTableSorting() {
        const table = document.getElementById('proyectosTable');
        if (!table) return;

        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (index === headers.length - 1 || index === 2) return; // Skip actions and description columns
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => this.sortTable(index));
            header.innerHTML += ' <i class="fas fa-sort sort-indicator"></i>';
        });
    }

    sortTable(columnIndex) {
        const table = document.getElementById('proyectosTable');
        const headers = table.querySelectorAll('th');
        const currentHeader = headers[columnIndex];
        const isAscending = !currentHeader.classList.contains('sort-asc');
        
        headers.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) indicator.className = 'fas fa-sort sort-indicator';
        });

        currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        const indicator = currentHeader.querySelector('.sort-indicator');
        if (indicator) {
            indicator.className = `fas fa-sort-${isAscending ? 'up' : 'down'} sort-indicator`;
        }

        const columns = ['id', 'titulo', 'resumen', 'fechaInicio', 'fechaFin'];
        const sortKey = columns[columnIndex];

        this.filteredProyectos.sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];

            if (sortKey === 'fechaInicio' || sortKey === 'fechaFin') {
                aVal = new Date(aVal || 0);
                bVal = new Date(bVal || 0);
            } else if (!isNaN(aVal) && !isNaN(bVal)) {
                aVal = Number(aVal);
                bVal = Number(bVal);
            }

            if (aVal < bVal) return isAscending ? -1 : 1;
            if (aVal > bVal) return isAscending ? 1 : -1;
            return 0;
        });

        this.renderTable();
    }

    async viewProyecto(id) {
        try {
            const proyecto = await API.proyectos.getById(id);
            this.showProyectoDetails(proyecto);
        } catch (error) {
            console.error('Error loading proyecto:', error);
            Utils.showNotification('Error al cargar los detalles del proyecto', 'error');
        }
    }

    showProyectoDetails(proyecto) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = 'Detalles del Proyecto';
        modalBody.innerHTML = `
            <div class="student-details">
                <div class="detail-group">
                    <label>ID:</label>
                    <span>${proyecto.id}</span>
                </div>
                <div class="detail-group">
                    <label>Título:</label>
                    <span>${proyecto.titulo}</span>
                </div>
                <div class="detail-group">
                    <label>Resumen:</label>
                    <span>${proyecto.resumen || 'Sin resumen'}</span>
                </div>
                <div class="detail-group">
                    <label>Fecha de Inicio:</label>
                    <span>${proyecto.fechaInicio ? Utils.formatDate(proyecto.fechaInicio) : 'No especificada'}</span>
                </div>
                <div class="detail-group">
                    <label>Fecha de Fin:</label>
                    <span>${proyecto.fechaFin ? Utils.formatDate(proyecto.fechaFin) : 'No especificada'}</span>
                </div>
            </div>
        `;

        this.openModal();
    }

    editProyecto(id) {
        const proyecto = this.proyectos.find(p => p.id === id);
        if (!proyecto) return;
        this.currentProyecto = proyecto;
        this.showProyectoForm(proyecto);
    }

    async deleteProyecto(id) {
        const confirmed = await Utils.confirmAction(
            '¿Estás seguro de que deseas eliminar este proyecto?',
            'Eliminar',
            'Cancelar'
        );

        if (!confirmed) return;

        try {
            await API.proyectos.delete(id);
            Utils.showNotification('Proyecto eliminado correctamente', 'success');
            this.loadTable();
        } catch (error) {
            console.error('Error deleting proyecto:', error);
            Utils.showNotification('Error al eliminar el proyecto', 'error');
        }
    }

    openModal() {
        Utils.openModal();
    }

    closeModal() {
        Utils.closeModal();
        this.currentProyecto = null;
    }

    showProyectoForm(proyecto = null) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto';
        
        // Formatear fecha para input date
        let fechaValue = '';
        if (proyecto?.fecha) {
            fechaValue = new Date(proyecto.fecha).toISOString().split('T')[0];
        }
        
        modalBody.innerHTML = `
            <form id="proyectoForm">
                <div class="form-group">
                    <label class="form-label">Título *</label>
                    <input type="text" name="titulo" class="form-input" required value="${proyecto?.titulo || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Resumen *</label>
                    <textarea name="resumen" class="form-textarea" required rows="4">${proyecto?.resumen || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha de Inicio</label>
                    <input type="date" name="fechaInicio" class="form-input" value="${proyecto?.fechaInicio ? new Date(proyecto.fechaInicio).toISOString().split('T')[0] : ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha de Fin</label>
                    <input type="date" name="fechaFin" class="form-input" value="${proyecto?.fechaFin ? new Date(proyecto.fechaFin).toISOString().split('T')[0] : ''}">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="proyectos.closeModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${proyecto ? 'Actualizar' : 'Crear'} Proyecto
                    </button>
                </div>
            </form>
        `;

        document.getElementById('proyectoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProyecto();
        });

        this.openModal();
    }

    async saveProyecto() {
        const form = document.getElementById('proyectoForm');
        const validation = Utils.validateForm(form);
        
        if (!validation.isValid) {
            Utils.showNotification(`Error: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        const formData = Utils.getFormData(form);
        
        try {
            Utils.showLoading();
            
            if (this.currentProyecto) {
                await API.proyectos.update(this.currentProyecto.id, formData);
                Utils.showNotification('Proyecto actualizado correctamente', 'success');
            } else {
                await API.proyectos.create(formData);
                Utils.showNotification('Proyecto creado correctamente', 'success');
            }
            
            this.closeModal();
            this.loadTable();
            Utils.hideLoading();
            
        } catch (error) {
            console.error('Error saving proyecto:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al guardar el proyecto', 'error');
        }
    }

    async exportProyectos() {
        try {
            const data = this.filteredProyectos.map(proyecto => ({
                ID: proyecto.id,
                Título: proyecto.titulo,
                Descripción: proyecto.descripcion,
                Estudiante: proyecto.estudiante,
                Estado: proyecto.estado,
                Fecha: Utils.formatDateOnly(proyecto.fecha)
            }));

            Utils.exportToCSV(data, `proyectos_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Error al exportar los datos', 'error');
        }
    }
}

// Crear instancia global
const proyectos = new ProyectosManager();

// Funciones globales
window.showProyectoForm = () => proyectos.showProyectoForm();
window.exportProyectos = () => proyectos.exportProyectos();

// Exportar para uso global
window.proyectos = proyectos;
