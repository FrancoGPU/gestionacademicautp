// Manejo de Estudiantes
console.log('Cargando estudiantes.js - Versión actualizada con servicios directos', new Date().toISOString());
class EstudiantesManager {
    constructor() {
        this.estudiantes = [];
        this.filteredEstudiantes = [];
        this.currentEstudiante = null;
        this.cursos = [];
        this.proyectos = [];
        this.profesores = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });

        // Load courses and projects data
        this.loadCursosAndProyectos();

        // Escuchar eventos de cambio de sección
        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'estudiantes') {
                this.loadTable();
            }
        });
    }

    async loadCursosAndProyectos() {
        try {
            const [cursosData, proyectosData, profesoresData] = await Promise.all([
                cursosService.getAll(),
                proyectosService.getAll(),
                profesoresService.getAll()
            ]);
            this.cursos = cursosData;
            this.proyectos = proyectosData;
            this.profesores = profesoresData;
        } catch (error) {
            console.error('Error loading courses, projects and professors:', error);
        }
    }

    setupEventListeners() {
        // Botón de búsqueda en tiempo real
        this.setupSearch();
        
        // Configurar ordenamiento de tabla
        this.setupTableSorting();
    }

    async loadTable() {
        try {
            Utils.showLoading();
            
            const data = await estudiantesService.getAll();
            this.estudiantes = data;
            this.filteredEstudiantes = [...data];
            
            this.renderTable();
            Utils.hideLoading();
            
        } catch (error) {
            console.error('Error loading estudiantes:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al cargar los estudiantes', 'error');
        }
    }

    renderTable() {
        const tbody = document.querySelector('#estudiantesTable tbody');
        if (!tbody) return;

        if (this.filteredEstudiantes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No se encontraron estudiantes
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredEstudiantes.map(estudiante => `
            <tr>
                <td>${estudiante.id}</td>
                <td>${estudiante.nombre} ${estudiante.apellido || ''}</td>
                <td>${estudiante.correo}</td>
                <td>${Utils.formatDateOnly(estudiante.fecha_nacimiento)}</td>
                <td>
                    <span class="status-badge status-active">
                        Activo
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="estudiantes.viewEstudiante(${estudiante.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="estudiantes.editEstudiante(${estudiante.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="estudiantes.deleteEstudiante(${estudiante.id})" title="Eliminar">
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
        // Crear barra de búsqueda si no existe
        const estudiantesSection = document.getElementById('estudiantes');
        const sectionHeader = estudiantesSection.querySelector('.section-header');
        
        let searchContainer = estudiantesSection.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-bar">
                    <input type="text" id="estudiantesSearch" placeholder="Buscar estudiantes por nombre, apellido o correo..." class="form-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
            `;
            
            // Insertar después del header
            sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
            
            // Agregar estilos
            this.addSearchStyles();
        }

        // Event listeners para búsqueda
        const searchInput = document.getElementById('estudiantesSearch');

        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filterEstudiantes();
            }, 300));
        }
    }

    populateCarreraFilter() {
        const carreraFilter = document.getElementById('carreraFilter');
        if (!carreraFilter || this.estudiantes.length === 0) return;

        const carreras = [...new Set(this.estudiantes.map(e => e.carrera))].sort();
        
        // Limpiar opciones existentes (excepto la primera)
        while (carreraFilter.children.length > 1) {
            carreraFilter.removeChild(carreraFilter.lastChild);
        }

        // Agregar opciones de carrera
        carreras.forEach(carrera => {
            const option = document.createElement('option');
            option.value = carrera;
            option.textContent = carrera;
            carreraFilter.appendChild(option);
        });
    }

    filterEstudiantes() {
        const searchTerm = document.getElementById('estudiantesSearch')?.value.toLowerCase() || '';

        this.filteredEstudiantes = this.estudiantes.filter(estudiante => {
            const matchesSearch = !searchTerm || 
                estudiante.nombre.toLowerCase().includes(searchTerm) ||
                estudiante.apellido?.toLowerCase().includes(searchTerm) ||
                estudiante.correo.toLowerCase().includes(searchTerm);

            return matchesSearch;
        });

        this.renderTable();
    }

    addSearchStyles() {
        if (document.getElementById('estudiantes-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'estudiantes-search-styles';
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
                flex: 1;
                min-width: 200px;
            }
            
            @media (max-width: 768px) {
                .search-filters {
                    flex-direction: column;
                }
                
                .search-filters select {
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupTableSorting() {
        const table = document.getElementById('estudiantesTable');
        if (!table) return;

        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            // Saltar la columna de acciones
            if (index === headers.length - 1) return;

            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                this.sortTable(index);
            });

            // Agregar indicador visual
            header.innerHTML += ' <i class="fas fa-sort sort-indicator"></i>';
        });
    }

    sortTable(columnIndex) {
        const table = document.getElementById('estudiantesTable');
        const headers = table.querySelectorAll('th');
        const currentHeader = headers[columnIndex];
        
        // Determinar dirección de ordenamiento
        const isAscending = !currentHeader.classList.contains('sort-asc');
        
        // Limpiar indicadores previos
        headers.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) {
                indicator.className = 'fas fa-sort sort-indicator';
            }
        });

        // Aplicar nuevo indicador
        currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        const indicator = currentHeader.querySelector('.sort-indicator');
        if (indicator) {
            indicator.className = `fas fa-sort-${isAscending ? 'up' : 'down'} sort-indicator`;
        }

        // Ordenar datos
        const columns = ['id', 'nombre', 'email', 'carrera', 'estado'];
        const sortKey = columns[columnIndex];

        this.filteredEstudiantes.sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];

            // Convertir a números si es posible
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

    async viewEstudiante(id) {
        try {
            const estudiante = await estudiantesService.getById(id);
            this.showEstudianteDetails(estudiante);
        } catch (error) {
            console.error('Error loading estudiante:', error);
            Utils.showNotification('Error al cargar los detalles del estudiante', 'error');
        }
    }

    showEstudianteDetails(estudiante) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        // Get course names from IDs with assigned professors
        const cursosAsignados = estudiante.cursoIds ? 
            estudiante.cursoIds.map(cursoId => {
                const curso = this.cursos.find(c => c.id === cursoId);
                if (!curso) return `Curso ID: ${cursoId}`;
                
                // Find professor assigned to this course
                const profesor = this.profesores.find(p => p.cursoIds && p.cursoIds.includes(cursoId));
                const profesorName = profesor ? ` (Prof. ${profesor.nombre} ${profesor.apellido})` : '';
                
                return `${curso.codigo} - ${curso.nombre}${profesorName}`;
            }) : [];
        
        // Get project titles from IDs
        const proyectosAsignados = estudiante.proyectoIds ? 
            estudiante.proyectoIds.map(proyectoId => {
                const proyecto = this.proyectos.find(p => p.id === proyectoId);
                return proyecto ? proyecto.titulo : `Proyecto ID: ${proyectoId}`;
            }) : [];
        
        modalTitle.textContent = 'Detalles del Estudiante';
        modalBody.innerHTML = `
            <div class="student-details">
                <div class="detail-group">
                    <label>ID:</label>
                    <span>${estudiante.id}</span>
                </div>
                <div class="detail-group">
                    <label>Nombre Completo:</label>
                    <span>${estudiante.nombre} ${estudiante.apellido || ''}</span>
                </div>
                <div class="detail-group">
                    <label>Correo:</label>
                    <span>${estudiante.correo}</span>
                </div>
                <div class="detail-group">
                    <label>Fecha de Nacimiento:</label>
                    <span>${Utils.formatDate(estudiante.fecha_nacimiento)}</span>
                </div>
                <div class="detail-group">
                    <label>Cursos Asignados:</label>
                    <div class="assignments-list">
                        ${cursosAsignados.length > 0 ? 
                            cursosAsignados.map(curso => `<span class="assignment-item">${curso}</span>`).join('') :
                            '<span class="no-assignments">No tiene cursos asignados</span>'
                        }
                    </div>
                </div>
                <div class="detail-group">
                    <label>Proyectos Asignados:</label>
                    <div class="assignments-list">
                        ${proyectosAsignados.length > 0 ? 
                            proyectosAsignados.map(proyecto => `<span class="assignment-item">${proyecto}</span>`).join('') :
                            '<span class="no-assignments">No tiene proyectos asignados</span>'
                        }
                    </div>
                </div>
            </div>
        `;

        this.addDetailsStyles();
        this.openModal();
    }

    addDetailsStyles() {
        if (document.getElementById('student-details-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'student-details-styles';
        styles.textContent = `
            .student-details {
                display: grid;
                gap: 1rem;
            }
            
            .detail-group {
                display: grid;
                grid-template-columns: 140px 1fr;
                gap: 1rem;
                align-items: start;
                padding: 0.75rem 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .detail-group:last-child {
                border-bottom: none;
            }
            
            .detail-group label {
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .detail-group span {
                color: var(--text-secondary);
            }
            
            .assignments-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .assignment-item {
                background-color: var(--background-color);
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                padding: 0.5rem 0.75rem;
                font-size: 0.875rem;
                color: var(--text-primary);
            }
            
            .no-assignments {
                color: var(--text-secondary);
                font-style: italic;
            }
        `;
        document.head.appendChild(styles);
    }

    editEstudiante(id) {
        const estudiante = this.estudiantes.find(e => e.id === id);
        if (!estudiante) return;

        this.currentEstudiante = estudiante;
        this.showEstudianteForm(estudiante);
    }

    async deleteEstudiante(id) {
        const confirmed = await Utils.confirmAction(
            '¿Estás seguro de que deseas eliminar este estudiante?',
            'Eliminar',
            'Cancelar'
        );

        if (!confirmed) return;

        try {
            await estudiantesService.delete(id);
            Utils.showNotification('Estudiante eliminado correctamente', 'success');
            this.loadTable();
        } catch (error) {
            console.error('Error deleting estudiante:', error);
            Utils.showNotification('Error al eliminar el estudiante', 'error');
        }
    }

    openModal() {
        Utils.openModal();
    }

    closeModal() {
        Utils.closeModal();
        this.currentEstudiante = null;
    }

    async showEstudianteForm(estudiante = null) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        // Recargar cursos y proyectos antes de mostrar el formulario
        try {
            Utils.showLoading();
            await this.loadCursosAndProyectos();
            Utils.hideLoading();
        } catch (error) {
            console.error('Error al cargar cursos y proyectos:', error);
            Utils.hideLoading();
            // Continuar con los datos existentes si hay error
        }
        
        modalTitle.textContent = estudiante ? 'Editar Estudiante' : 'Nuevo Estudiante';
        
        modalBody.innerHTML = `
            <form id="estudianteForm">
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" name="nombre" class="form-input" required value="${estudiante?.nombre || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Apellido *</label>
                    <input type="text" name="apellido" class="form-input" required value="${estudiante?.apellido || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Correo *</label>
                    <input type="email" name="correo" class="form-input" required value="${estudiante?.correo || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha de Nacimiento *</label>
                    <input type="date" name="fecha_nacimiento" class="form-input" required value="${estudiante?.fecha_nacimiento || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cursos Asignados</label>
                    <select name="cursoIds" class="form-select" multiple style="height: 120px;">
                        ${this.cursos.map(curso => `
                            <option value="${curso.id}" ${estudiante?.cursoIds?.includes(curso.id) ? 'selected' : ''}>
                                ${curso.codigo} - ${curso.nombre}
                            </option>
                        `).join('')}
                    </select>
                    <small class="form-help">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples cursos</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Proyectos Asignados</label>
                    <select name="proyectoIds" class="form-select" multiple style="height: 120px;">
                        ${this.proyectos.map(proyecto => `
                            <option value="${proyecto.id}" ${estudiante?.proyectoIds?.includes(proyecto.id) ? 'selected' : ''}>
                                ${proyecto.titulo}
                            </option>
                        `).join('')}
                    </select>
                    <small class="form-help">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples proyectos</small>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="estudiantes.closeModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${estudiante ? 'Actualizar' : 'Crear'} Estudiante
                    </button>
                </div>
            </form>
        `;

        // Event listener para el formulario
        document.getElementById('estudianteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEstudiante();
        });

        this.openModal();
    }

    async saveEstudiante() {
        const form = document.getElementById('estudianteForm');
        const validation = Utils.validateForm(form);
        
        if (!validation.isValid) {
            Utils.showNotification(`Error: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        const formData = Utils.getFormData(form);
        
        // Handle multiple select arrays
        const cursoSelect = form.querySelector('select[name="cursoIds"]');
        const proyectoSelect = form.querySelector('select[name="proyectoIds"]');
        
        formData.cursoIds = Array.from(cursoSelect.selectedOptions).map(option => parseInt(option.value));
        formData.proyectoIds = Array.from(proyectoSelect.selectedOptions).map(option => option.value);
        
        try {
            Utils.showLoading();
            
            if (this.currentEstudiante) {
                // Actualizar
                await estudiantesService.update(this.currentEstudiante.id, formData);
                Utils.showNotification('Estudiante actualizado correctamente', 'success');
            } else {
                // Crear nuevo
                await estudiantesService.create(formData);
                Utils.showNotification('Estudiante creado correctamente', 'success');
            }
            
            this.closeModal();
            this.loadTable();
            Utils.hideLoading();
            
        } catch (error) {
            console.error('Error saving estudiante:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al guardar el estudiante', 'error');
        }
    }

    // Función para exportar estudiantes
    async exportEstudiantes() {
        try {
            const data = this.filteredEstudiantes.map(estudiante => ({
                ID: estudiante.id,
                Nombre: estudiante.nombre,
                Email: estudiante.email,
                Carrera: estudiante.carrera,
                Estado: estudiante.estado,
                'Fecha de Ingreso': Utils.formatDateOnly(estudiante.fechaIngreso)
            }));

            Utils.exportToCSV(data, `estudiantes_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Error al exportar los datos', 'error');
        }
    }
}

// Crear instancia global
const estudiantes = new EstudiantesManager();

// Funciones globales
window.showEstudianteForm = () => estudiantes.showEstudianteForm();
window.exportEstudiantes = () => estudiantes.exportEstudiantes();

// Exportar para uso global
window.Estudiantes = estudiantes;
