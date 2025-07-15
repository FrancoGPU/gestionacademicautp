// Manejo de Cursos
class CursosManager {
    constructor() {
        this.cursos = [];
        this.filteredCursos = [];
        this.currentCurso = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });

        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'cursos') {
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
            const data = await API.cursos.getAll();
            this.cursos = data;
            this.filteredCursos = [...data];
            this.renderTable();
            Utils.hideLoading();
        } catch (error) {
            console.error('Error loading cursos:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al cargar los cursos', 'error');
        }
    }

    renderTable() {
        const tbody = document.querySelector('#cursosTable tbody');
        if (!tbody) return;

        if (this.filteredCursos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No se encontraron cursos</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredCursos.map(curso => `
            <tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.codigo}</td>
                <td>${curso.creditos}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="cursos.viewCurso(${curso.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="cursos.editCurso(${curso.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="cursos.deleteCurso(${curso.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusClass(estado) {
        const statusMap = {
            'Activo': 'status-active',
            'Inactivo': 'status-inactive',
            'Pendiente': 'status-pending'
        };
        return statusMap[estado] || 'status-inactive';
    }

    setupSearch() {
        const cursosSection = document.getElementById('cursos');
        const sectionHeader = cursosSection.querySelector('.section-header');
        
        let searchContainer = cursosSection.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-bar">
                    <input type="text" id="cursosSearch" placeholder="Buscar cursos..." class="form-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="search-filters">
                    <select id="creditosFilter" class="form-select">
                        <option value="">Todos los créditos</option>
                        <option value="2">2 créditos</option>
                        <option value="3">3 créditos</option>
                        <option value="4">4 créditos</option>
                        <option value="5">5 créditos</option>
                    </select>
                </div>
            `;
            sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
            
            // Agregar estilos CSS
            this.addSearchStyles();
        }

        const searchInput = document.getElementById('cursosSearch');
        const creditosFilter = document.getElementById('creditosFilter');

        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => this.filterCursos(), 300));
        }
        if (creditosFilter) {
            creditosFilter.addEventListener('change', () => this.filterCursos());
        }
    }

    addSearchStyles() {
        if (document.getElementById('cursos-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cursos-search-styles';
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
            
            .search-filters select {
                min-width: 150px;
            }
        `;
        document.head.appendChild(styles);
    }

    filterCursos() {
        const searchTerm = document.getElementById('cursosSearch')?.value.toLowerCase() || '';
        const creditosFilter = document.getElementById('creditosFilter')?.value || '';

        this.filteredCursos = this.cursos.filter(curso => {
            const matchesSearch = !searchTerm || 
                curso.nombre.toLowerCase().includes(searchTerm) ||
                curso.codigo.toLowerCase().includes(searchTerm);
            
            const matchesCreditos = !creditosFilter || curso.creditos.toString() === creditosFilter;

            return matchesSearch && matchesCreditos;
        });

        this.renderTable();
    }

    setupTableSorting() {
        const table = document.getElementById('cursosTable');
        if (!table) return;

        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (index === headers.length - 1) return;
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => this.sortTable(index));
            header.innerHTML += ' <i class="fas fa-sort sort-indicator"></i>';
        });
    }

    sortTable(columnIndex) {
        const table = document.getElementById('cursosTable');
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

        const columns = ['id', 'nombre', 'codigo', 'creditos', 'profesor', 'estado'];
        const sortKey = columns[columnIndex];

        this.filteredCursos.sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];

            if (!isNaN(aVal) && !isNaN(bVal)) {
                aVal = Number(aVal);
                bVal = Number(bVal);
            }

            if (aVal < bVal) return isAscending ? -1 : 1;
            if (aVal > bVal) return isAscending ? 1 : -1;
            return 0;
        });

        this.renderTable();
    }

    async viewCurso(id) {
        try {
            const curso = await API.cursos.getById(id);
            this.showCursoDetails(curso);
        } catch (error) {
            console.error('Error loading curso:', error);
            Utils.showNotification('Error al cargar los detalles del curso', 'error');
        }
    }

    showCursoDetails(curso) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = 'Detalles del Curso';
        modalBody.innerHTML = `
            <div class="student-details">
                <div class="detail-group">
                    <label>ID:</label>
                    <span>${curso.id}</span>
                </div>
                <div class="detail-group">
                    <label>Nombre:</label>
                    <span>${curso.nombre}</span>
                </div>
                <div class="detail-group">
                    <label>Código:</label>
                    <span>${curso.codigo}</span>
                </div>
                <div class="detail-group">
                    <label>Créditos:</label>
                    <span>${curso.creditos}</span>
                </div>
                <div class="detail-group">
                    <label>Profesor:</label>
                    <span>${curso.profesor}</span>
                </div>
                <div class="detail-group">
                    <label>Estado:</label>
                    <span class="status-badge ${this.getStatusClass(curso.estado)}">${curso.estado}</span>
                </div>
                <div class="detail-group">
                    <label>Semestre:</label>
                    <span>${curso.semestre || 'No especificado'}</span>
                </div>
            </div>
        `;

        this.openModal();
    }

    editCurso(id) {
        const curso = this.cursos.find(c => c.id === id);
        if (!curso) return;
        this.currentCurso = curso;
        this.showCursoForm(curso);
    }

    async deleteCurso(id) {
        const confirmed = await Utils.confirmAction(
            '¿Estás seguro de que deseas eliminar este curso?',
            'Eliminar',
            'Cancelar'
        );

        if (!confirmed) return;

        try {
            await API.cursos.delete(id);
            Utils.showNotification('Curso eliminado correctamente', 'success');
            this.loadTable();
        } catch (error) {
            console.error('Error deleting curso:', error);
            Utils.showNotification('Error al eliminar el curso', 'error');
        }
    }

    openModal() {
        Utils.openModal();
    }

    closeModal() {
        Utils.closeModal();
        this.currentCurso = null;
    }

    showCursoForm(curso = null) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = curso ? 'Editar Curso' : 'Nuevo Curso';
        
        modalBody.innerHTML = `
            <form id="cursoForm">
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" name="nombre" class="form-input" required value="${curso?.nombre || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Código *</label>
                    <input type="text" name="codigo" class="form-input" required value="${curso?.codigo || ''}" placeholder="Ej: PROG101">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Créditos *</label>
                    <select name="creditos" class="form-select" required>
                        <option value="">Seleccionar créditos</option>
                        <option value="2" ${curso?.creditos == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${curso?.creditos == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${curso?.creditos == 4 ? 'selected' : ''}>4</option>
                        <option value="5" ${curso?.creditos == 5 ? 'selected' : ''}>5</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cursos.closeModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${curso ? 'Actualizar' : 'Crear'} Curso
                    </button>
                </div>
            </form>
        `;

        document.getElementById('cursoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCurso();
        });

        this.openModal();
    }

    async saveCurso() {
        const form = document.getElementById('cursoForm');
        const validation = Utils.validateForm(form);
        
        if (!validation.isValid) {
            Utils.showNotification(`Error: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        const formData = Utils.getFormData(form);
        formData.creditos = parseInt(formData.creditos);
        
        try {
            Utils.showLoading();
            
            if (this.currentCurso) {
                await API.cursos.update(this.currentCurso.id, formData);
                Utils.showNotification('Curso actualizado correctamente', 'success');
            } else {
                await API.cursos.create(formData);
                Utils.showNotification('Curso creado correctamente', 'success');
            }
            
            this.closeModal();
            this.loadTable();
            Utils.hideLoading();
            
        } catch (error) {
            console.error('Error saving curso:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al guardar el curso', 'error');
        }
    }

    async exportCursos() {
        try {
            const data = this.filteredCursos.map(curso => ({
                ID: curso.id,
                Nombre: curso.nombre,
                Código: curso.codigo,
                Créditos: curso.creditos,
                Profesor: curso.profesor,
                Estado: curso.estado,
                Semestre: curso.semestre || ''
            }));

            Utils.exportToCSV(data, `cursos_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Error al exportar los datos', 'error');
        }
    }
}

// Crear instancia global
const cursos = new CursosManager();

// Funciones globales
window.showCursoForm = () => cursos.showCursoForm();
window.exportCursos = () => cursos.exportCursos();

// Exportar para uso global
window.cursos = cursos;
