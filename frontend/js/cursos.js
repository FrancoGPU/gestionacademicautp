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

        const columns = ['id', 'nombre', 'codigo', 'creditos'];
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
                    <label class="form-label">Código ${curso ? '*' : '(opcional)'}</label>
                    <input type="text" name="codigo" class="form-input" ${curso ? 'required' : ''} value="${curso?.codigo || ''}" placeholder="Ej: PROG101 (se generará automáticamente si se deja vacío)">
                    ${!curso ? '<small class="form-help">💡 Si no especifica un código, se generará automáticamente basado en el nombre del curso</small>' : ''}
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
        
        // Generar código automáticamente si no se proporciona uno
        if (!formData.codigo || formData.codigo.trim() === '') {
            formData.codigo = await this.generateUniqueCourseCode(formData.nombre);
        }
        
        // Validar que el código no exista (solo para cursos nuevos)
        if (!this.currentCurso && await this.courseCodeExists(formData.codigo)) {
            Utils.showNotification(`Error: Ya existe un curso con el código '${formData.codigo}'. Por favor, use un código diferente.`, 'error');
            return;
        }
        
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
            
            // Mostrar mensaje más específico para errores de duplicado
            if (error.message.includes('Duplicate entry') || error.message.includes('codigo')) {
                Utils.showNotification(`Error: El código '${formData.codigo}' ya existe. Por favor, use un código único.`, 'error');
            } else {
                Utils.showNotification('Error al guardar el curso', 'error');
            }
        }
    }

    // Verificar si un código de curso ya existe
    async courseCodeExists(codigo) {
        try {
            const existingCourses = await API.cursos.getAll();
            return existingCourses.some(curso => curso.codigo.toLowerCase() === codigo.toLowerCase());
        } catch (error) {
            console.error('Error checking course code:', error);
            return false;
        }
    }

    // Generar un código único de curso
    async generateUniqueCourseCode(nombre) {
        try {
            // Extraer las primeras letras del nombre del curso
            const palabras = nombre.toUpperCase().split(' ').filter(p => p.length > 0);
            let prefix = '';
            
            // Generar prefijo basado en las palabras del nombre
            if (palabras.length >= 2) {
                prefix = palabras[0].substring(0, 3) + palabras[1].substring(0, 2);
            } else if (palabras.length === 1) {
                prefix = palabras[0].substring(0, 5);
            } else {
                prefix = 'CURSO';
            }
            
            // Generar número secuencial
            const existingCourses = await API.cursos.getAll();
            let maxNumber = 0;
            
            existingCourses.forEach(curso => {
                const match = curso.codigo.match(/(\d+)$/);
                if (match) {
                    const number = parseInt(match[1]);
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                }
            });
            
            // Generar código único
            let attempts = 0;
            let codigo;
            do {
                const number = String(maxNumber + 1 + attempts).padStart(3, '0');
                codigo = prefix + number;
                attempts++;
            } while (await this.courseCodeExists(codigo) && attempts < 100);
            
            return codigo;
        } catch (error) {
            console.error('Error generating course code:', error);
            // Fallback: usar timestamp
            return 'C' + Date.now().toString().slice(-5);
        }
    }

    async exportCursos() {
        try {
            const data = this.filteredCursos.map(curso => ({
                ID: curso.id,
                Nombre: curso.nombre,
                Código: curso.codigo,
                Créditos: curso.creditos
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
