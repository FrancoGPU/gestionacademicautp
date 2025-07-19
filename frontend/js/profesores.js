// Manejo de Profesores - Similar estructura a estudiantes
console.log('Cargando profesores.js - Versión actualizada con profesoresService');
class ProfesoresManager {
    constructor() {
        this.profesores = [];
        this.filteredProfesores = [];
        this.currentProfesor = null;
        this.cursos = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.loadCursos();
        });

        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'profesores') {
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
            const data = await profesoresService.getAll();
            this.profesores = data;
            this.filteredProfesores = [...data];
            this.renderTable();
            this.populateEspecialidadFilter(); // Call after data is loaded
            Utils.hideLoading();
        } catch (error) {
            console.error('Error loading profesores:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al cargar los profesores', 'error');
        }
    }

    renderTable() {
        const tbody = document.querySelector('#profesoresTable tbody');
        if (!tbody) return;

        if (this.filteredProfesores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No se encontraron profesores</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredProfesores.map(profesor => `
            <tr>
                <td>${profesor.id}</td>
                <td>${profesor.nombre} ${profesor.apellido || ''}</td>
                <td>${profesor.correo || profesor.email || ''}</td>
                <td>${profesor.especialidad}</td>
                <td><span class="status-badge ${profesor.activo ? 'status-active' : 'status-inactive'}">${profesor.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="profesores.viewProfesor('${profesor.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="profesores.editProfesor('${profesor.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="profesores.deleteProfesor('${profesor.id}')" title="Eliminar">
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
        const profesoresSection = document.getElementById('profesores');
        const sectionHeader = profesoresSection.querySelector('.section-header');
        
        let searchContainer = profesoresSection.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-bar">
                    <input type="text" id="profesoresSearch" placeholder="Buscar profesores..." class="form-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="search-filters">
                    <select id="especialidadFilter" class="form-select">
                        <option value="">Todas las especialidades</option>
                    </select>
                    <select id="estadoFilter" class="form-select">
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            `;
            sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
            
            // Agregar estilos CSS
            this.addSearchStyles();
        }

        const searchInput = document.getElementById('profesoresSearch');
        const especialidadFilter = document.getElementById('especialidadFilter');
        const estadoFilter = document.getElementById('estadoFilter');

        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => this.filterProfesores(), 300));
        }
        if (especialidadFilter) {
            especialidadFilter.addEventListener('change', () => this.filterProfesores());
        }
        if (estadoFilter) {
            estadoFilter.addEventListener('change', () => this.filterProfesores());
        }

        // Remove this call from here since it will be called after data loads
        // this.populateEspecialidadFilter();
    }

    addSearchStyles() {
        if (document.getElementById('profesores-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'profesores-search-styles';
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

    populateEspecialidadFilter() {
        const filter = document.getElementById('especialidadFilter');
        if (!filter || this.profesores.length === 0) return;

        const especialidades = [...new Set(this.profesores.map(p => p.especialidad))].sort();
        
        while (filter.children.length > 1) {
            filter.removeChild(filter.lastChild);
        }

        especialidades.forEach(especialidad => {
            const option = document.createElement('option');
            option.value = especialidad;
            option.textContent = especialidad;
            filter.appendChild(option);
        });
    }

    filterProfesores() {
        const searchTerm = document.getElementById('profesoresSearch')?.value.toLowerCase() || '';
        const especialidadFilter = document.getElementById('especialidadFilter')?.value || '';
        const estadoFilter = document.getElementById('estadoFilter')?.value || '';

        this.filteredProfesores = this.profesores.filter(profesor => {
            const matchesSearch = !searchTerm || 
                profesor.nombre.toLowerCase().includes(searchTerm) ||
                (profesor.correo && profesor.correo.toLowerCase().includes(searchTerm)) ||
                (profesor.email && profesor.email.toLowerCase().includes(searchTerm)) ||
                profesor.especialidad.toLowerCase().includes(searchTerm);
            
            const matchesEspecialidad = !especialidadFilter || profesor.especialidad === especialidadFilter;
            const matchesEstado = !estadoFilter || (profesor.activo ? 'Activo' : 'Inactivo') === estadoFilter;

            return matchesSearch && matchesEspecialidad && matchesEstado;
        });

        this.renderTable();
    }

    setupTableSorting() {
        const table = document.getElementById('profesoresTable');
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
        const table = document.getElementById('profesoresTable');
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

        const columns = ['id', 'nombre', 'email', 'especialidad', 'estado'];
        const sortKey = columns[columnIndex];

        this.filteredProfesores.sort((a, b) => {
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

    async viewProfesor(id) {
        try {
            const profesor = await profesoresService.getById(id);
            this.showProfesorDetails(profesor);
        } catch (error) {
            console.error('Error loading profesor:', error);
            Utils.showNotification('Error al cargar los detalles del profesor', 'error');
        }
    }

    showProfesorDetails(profesor) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        // Get assigned course names
        const assignedCourses = profesor.cursoIds ? 
            profesor.cursoIds.map(cursoId => {
                const curso = this.cursos.find(c => c.id === cursoId);
                return curso ? `${curso.codigo} - ${curso.nombre}` : `Curso ID: ${cursoId}`;
            }) : [];
        
        modalTitle.textContent = 'Detalles del Profesor';
        modalBody.innerHTML = `
            <div class="student-details">
                <div class="detail-group">
                    <label>ID:</label>
                    <span>${profesor.id}</span>
                </div>
                <div class="detail-group">
                    <label>Nombre Completo:</label>
                    <span>${profesor.nombre} ${profesor.apellido}</span>
                </div>
                <div class="detail-group">
                    <label>Correo:</label>
                    <span>${profesor.correo}</span>
                </div>
                <div class="detail-group">
                    <label>Especialidad:</label>
                    <span>${profesor.especialidad}</span>
                </div>
                <div class="detail-group">
                    <label>Teléfono:</label>
                    <span>${profesor.telefono || 'No especificado'}</span>
                </div>
                <div class="detail-group">
                    <label>Grado Académico:</label>
                    <span>${profesor.gradoAcademico || 'No especificado'}</span>
                </div>
                <div class="detail-group">
                    <label>Años de Experiencia:</label>
                    <span>${profesor.anosExperiencia || 'No especificado'}</span>
                </div>
                <div class="detail-group">
                    <label>Estado:</label>
                    <span class="status-badge ${profesor.activo ? 'status-active' : 'status-inactive'}">${profesor.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div class="detail-group">
                    <label>Cursos Asignados:</label>
                    <div class="assignment-list">
                        ${assignedCourses.length > 0 ? 
                            assignedCourses.map(curso => `<span class="assignment-item">${curso}</span>`).join('') : 
                            '<span class="no-assignments">No tiene cursos asignados</span>'
                        }
                    </div>
                </div>
            </div>
        `;

        this.openModal();
    }

    editProfesor(id) {
        const profesor = this.profesores.find(p => p.id === id);
        if (!profesor) return;
        this.currentProfesor = profesor;
        this.showProfesorForm(profesor);
    }

    async deleteProfesor(id) {
        const confirmed = await Utils.confirmAction(
            '¿Estás seguro de que deseas eliminar este profesor?',
            'Eliminar',
            'Cancelar'
        );

        if (!confirmed) return;

        try {
            await profesoresService.delete(id);
            Utils.showNotification('Profesor eliminado correctamente', 'success');
            this.loadTable();
        } catch (error) {
            console.error('Error deleting profesor:', error);
            Utils.showNotification('Error al eliminar el profesor', 'error');
        }
    }

    openModal() {
        Utils.openModal();
    }

    closeModal() {
        Utils.closeModal();
        this.currentProfesor = null;
    }

    showProfesorForm(profesor = null) {
        // Recargar cursos para asegurar que estén actualizados
        console.log('🔄 Recargando cursos antes de mostrar modal...');
        this.loadCursos().then(() => {
            console.log(`📚 Cursos cargados: ${this.cursos.length}`);
            this.renderModalContent(profesor);
        });
    }

    renderModalContent(profesor = null) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = profesor ? 'Editar Profesor' : 'Nuevo Profesor';
        
        modalBody.innerHTML = `
            <form id="profesorForm">
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" name="nombre" class="form-input" required value="${profesor?.nombre || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Apellido *</label>
                    <input type="text" name="apellido" class="form-input" required value="${profesor?.apellido || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Correo *</label>
                    <input type="email" name="correo" class="form-input" required value="${profesor?.correo || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Especialidad *</label>
                    <select name="especialidad" class="form-select" required>
                        <option value="">Seleccionar especialidad</option>
                        <option value="Programación" ${profesor?.especialidad === 'Programación' ? 'selected' : ''}>Programación</option>
                        <option value="Base de Datos" ${profesor?.especialidad === 'Base de Datos' ? 'selected' : ''}>Base de Datos</option>
                        <option value="Redes de Computadoras" ${profesor?.especialidad === 'Redes de Computadoras' ? 'selected' : ''}>Redes de Computadoras</option>
                        <option value="Ingeniería de Software" ${profesor?.especialidad === 'Ingeniería de Software' ? 'selected' : ''}>Ingeniería de Software</option>
                        <option value="Desarrollo Web" ${profesor?.especialidad === 'Desarrollo Web' ? 'selected' : ''}>Desarrollo Web</option>
                        <option value="Estructuras de Datos" ${profesor?.especialidad === 'Estructuras de Datos' ? 'selected' : ''}>Estructuras de Datos</option>
                        <option value="Sistemas Operativos" ${profesor?.especialidad === 'Sistemas Operativos' ? 'selected' : ''}>Sistemas Operativos</option>
                        <option value="Arquitectura de Computadoras" ${profesor?.especialidad === 'Arquitectura de Computadoras' ? 'selected' : ''}>Arquitectura de Computadoras</option>
                        <option value="Matemáticas" ${profesor?.especialidad === 'Matemáticas' ? 'selected' : ''}>Matemáticas</option>
                        <option value="Física" ${profesor?.especialidad === 'Física' ? 'selected' : ''}>Física</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="text" name="telefono" class="form-input" value="${profesor?.telefono || ''}" placeholder="Ej: +51-999-999-999">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Grado Académico</label>
                    <select name="gradoAcademico" class="form-select">
                        <option value="Bachiller" ${profesor?.gradoAcademico === 'Bachiller' ? 'selected' : ''}>Bachiller</option>
                        <option value="Licenciado" ${profesor?.gradoAcademico === 'Licenciado' ? 'selected' : ''}>Licenciado</option>
                        <option value="Magister" ${profesor?.gradoAcademico === 'Magister' ? 'selected' : ''}>Magister</option>
                        <option value="Doctor" ${profesor?.gradoAcademico === 'Doctor' ? 'selected' : ''}>Doctor</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Años de Experiencia</label>
                    <input type="number" name="anosExperiencia" class="form-input" value="${profesor?.anosExperiencia || ''}" min="0">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select name="activo" class="form-select">
                        <option value="true" ${profesor?.activo === true ? 'selected' : ''}>Activo</option>
                        <option value="false" ${profesor?.activo === false ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cursos Asignados</label>
                    <select name="cursoIds" class="form-select" multiple size="6">
                        ${this.cursos.map(curso => {
                            const isSelected = profesor?.cursoIds && Array.isArray(profesor.cursoIds) && profesor.cursoIds.includes(curso.id);
                            return `<option value="${curso.id}" ${isSelected ? 'selected' : ''}>
                                ${curso.codigo} - ${curso.nombre}
                            </option>`;
                        }).join('')}
                    </select>
                    <small class="form-help">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples cursos</small>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="profesores.closeModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${profesor ? 'Actualizar' : 'Crear'} Profesor
                    </button>
                </div>
            </form>
        `;

        document.getElementById('profesorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfesor();
        });

        this.openModal();
    }

    async saveProfesor() {
        const form = document.getElementById('profesorForm');
        const validation = Utils.validateForm(form);
        
        if (!validation.isValid) {
            Utils.showNotification(`Error: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        const formData = Utils.getFormData(form);
        
        // Handle multiple select for cursoIds
        const cursoSelect = form.querySelector('select[name="cursoIds"]');
        if (cursoSelect) {
            const selectedCursos = Array.from(cursoSelect.selectedOptions).map(option => parseInt(option.value));
            formData.cursoIds = selectedCursos.length > 0 ? selectedCursos : null;
            console.log('Cursos seleccionados:', formData.cursoIds);
        } else {
            formData.cursoIds = null;
        }
        
        try {
            Utils.showLoading();
            
            if (this.currentProfesor) {
                console.log('Actualizando profesor:', this.currentProfesor.id, formData);
                await profesoresService.update(this.currentProfesor.id, formData);
                Utils.showNotification('Profesor actualizado correctamente', 'success');
            } else {
                console.log('Creando nuevo profesor:', formData);
                await profesoresService.create(formData);
                Utils.showNotification('Profesor creado correctamente', 'success');
            }
            
            this.closeModal();
            this.loadTable();
            Utils.hideLoading();
            
        } catch (error) {
            console.error('Error saving profesor:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al guardar el profesor', 'error');
        }
    }

    async exportProfesores() {
        try {
            const data = this.filteredProfesores.map(profesor => ({
                ID: profesor.id,
                Nombre: profesor.nombre,
                Email: profesor.email,
                Especialidad: profesor.especialidad,
                Estado: profesor.estado,
                Experiencia: profesor.experiencia || ''
            }));

            Utils.exportToCSV(data, `profesores_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Error al exportar los datos', 'error');
        }
    }

    async loadCursos() {
        try {
            console.log('📡 Cargando cursos desde API...');
            this.cursos = await cursosService.getAll();
            console.log(`✅ ${this.cursos.length} cursos cargados exitosamente`);
        } catch (error) {
            console.error('❌ Error loading cursos:', error);
            this.cursos = [];
        }
    }
}

// Crear instancia global
const profesores = new ProfesoresManager();

// Funciones globales
window.showProfesorForm = () => profesores.showProfesorForm();

// Exportar para uso global
window.profesores = profesores;

window.showProfesorForm = () => profesores.showProfesorForm();
window.exportProfesores = () => profesores.exportProfesores();
window.Profesores = profesores;
