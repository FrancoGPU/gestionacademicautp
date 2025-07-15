// Manejo de Reportes
class ReportesManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });

        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'reportes') {
                this.loadReportesSection();
            }
        });
    }

    setupEventListeners() {
        // Los botones ya están configurados en el HTML con onclick
    }

    loadReportesSection() {
        // Cargar estadísticas adicionales para reportes
        this.loadReportStats();
    }

    async loadReportStats() {
        try {
            const stats = await API.reportes.getDashboardStats();
            this.updateReportCards(stats);
        } catch (error) {
            console.error('Error loading report stats:', error);
        }
    }

    updateReportCards(stats) {
        // Agregar estadísticas a las tarjetas de reporte si es necesario
        const reportCards = document.querySelectorAll('.report-card');
        reportCards.forEach((card, index) => {
            const button = card.querySelector('button');
            if (button) {
                let count = 0;
                switch (index) {
                    case 0: count = stats.totalEstudiantes; break;
                    case 1: count = stats.totalProfesores; break;
                    case 2: count = stats.totalCursos; break;
                }
                
                if (count > 0) {
                    const p = card.querySelector('p');
                    p.textContent = `${p.textContent} (${count} registros)`;
                }
            }
        });
    }

    async generateEstudiantesReport() {
        try {
            Utils.showLoading();
            Utils.showNotification('Generando reporte de estudiantes...', 'info');
            
            const data = await API.estudiantes.getAll();
            const reportData = data.map(estudiante => ({
                ID: estudiante.id,
                Nombre: estudiante.nombre,
                Email: estudiante.email,
                Carrera: estudiante.carrera,
                Estado: estudiante.estado,
                'Fecha de Ingreso': Utils.formatDateOnly(estudiante.fechaIngreso)
            }));

            // Generar estadísticas adicionales
            const stats = this.generateEstudiantesStats(data);
            
            // Crear reporte completo
            const fullReport = [
                { Tipo: 'ESTADÍSTICAS' },
                { 'Total de Estudiantes': stats.total },
                { 'Estudiantes Activos': stats.activos },
                { 'Estudiantes Inactivos': stats.inactivos },
                { 'Carrera más Popular': stats.carreraMasPopular },
                { 'Fecha de Generación': Utils.formatDate(new Date()) },
                {},
                { Tipo: 'DATOS DETALLADOS' },
                ...reportData
            ];

            Utils.exportToCSV(fullReport, `reporte_estudiantes_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.hideLoading();
            Utils.showNotification('Reporte de estudiantes generado correctamente', 'success');
            
        } catch (error) {
            console.error('Error generating estudiantes report:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al generar el reporte de estudiantes', 'error');
        }
    }

    generateEstudiantesStats(data) {
        const total = data.length;
        const activos = data.filter(e => e.estado === 'Activo').length;
        const inactivos = data.filter(e => e.estado === 'Inactivo').length;
        
        // Encontrar carrera más popular
        const carreras = {};
        data.forEach(e => {
            carreras[e.carrera] = (carreras[e.carrera] || 0) + 1;
        });
        
        const carreraMasPopular = Object.keys(carreras).reduce((a, b) => 
            carreras[a] > carreras[b] ? a : b, '');

        return {
            total,
            activos,
            inactivos,
            carreraMasPopular: `${carreraMasPopular} (${carreras[carreraMasPopular]} estudiantes)`
        };
    }

    async generateProfesoresReport() {
        try {
            Utils.showLoading();
            Utils.showNotification('Generando reporte de profesores...', 'info');
            
            const data = await API.profesores.getAll();
            const reportData = data.map(profesor => ({
                ID: profesor.id,
                Nombre: profesor.nombre,
                Email: profesor.email,
                Especialidad: profesor.especialidad,
                Estado: profesor.estado,
                Experiencia: profesor.experiencia || 'No especificado'
            }));

            const stats = this.generateProfesoresStats(data);
            
            const fullReport = [
                { Tipo: 'ESTADÍSTICAS' },
                { 'Total de Profesores': stats.total },
                { 'Profesores Activos': stats.activos },
                { 'Profesores Inactivos': stats.inactivos },
                { 'Especialidad más Común': stats.especialidadMasComun },
                { 'Fecha de Generación': Utils.formatDate(new Date()) },
                {},
                { Tipo: 'DATOS DETALLADOS' },
                ...reportData
            ];

            Utils.exportToCSV(fullReport, `reporte_profesores_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.hideLoading();
            Utils.showNotification('Reporte de profesores generado correctamente', 'success');
            
        } catch (error) {
            console.error('Error generating profesores report:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al generar el reporte de profesores', 'error');
        }
    }

    generateProfesoresStats(data) {
        const total = data.length;
        const activos = data.filter(p => p.estado === 'Activo').length;
        const inactivos = data.filter(p => p.estado === 'Inactivo').length;
        
        const especialidades = {};
        data.forEach(p => {
            especialidades[p.especialidad] = (especialidades[p.especialidad] || 0) + 1;
        });
        
        const especialidadMasComun = Object.keys(especialidades).reduce((a, b) => 
            especialidades[a] > especialidades[b] ? a : b, '');

        return {
            total,
            activos,
            inactivos,
            especialidadMasComun: `${especialidadMasComun} (${especialidades[especialidadMasComun]} profesores)`
        };
    }

    async generateCursosReport() {
        try {
            Utils.showLoading();
            Utils.showNotification('Generando reporte de cursos...', 'info');
            
            const data = await API.cursos.getAll();
            const reportData = data.map(curso => ({
                ID: curso.id,
                Nombre: curso.nombre,
                Código: curso.codigo,
                Créditos: curso.creditos,
                Profesor: curso.profesor,
                Estado: curso.estado,
                Semestre: curso.semestre || 'No especificado'
            }));

            const stats = this.generateCursosStats(data);
            
            const fullReport = [
                { Tipo: 'ESTADÍSTICAS' },
                { 'Total de Cursos': stats.total },
                { 'Cursos Activos': stats.activos },
                { 'Cursos Inactivos': stats.inactivos },
                { 'Total de Créditos': stats.totalCreditos },
                { 'Promedio de Créditos': stats.promedioCreditos },
                { 'Fecha de Generación': Utils.formatDate(new Date()) },
                {},
                { Tipo: 'DATOS DETALLADOS' },
                ...reportData
            ];

            Utils.exportToCSV(fullReport, `reporte_cursos_${Utils.formatDateOnly(new Date())}.csv`);
            Utils.hideLoading();
            Utils.showNotification('Reporte de cursos generado correctamente', 'success');
            
        } catch (error) {
            console.error('Error generating cursos report:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al generar el reporte de cursos', 'error');
        }
    }

    generateCursosStats(data) {
        const total = data.length;
        const activos = data.filter(c => c.estado === 'Activo').length;
        const inactivos = data.filter(c => c.estado === 'Inactivo').length;
        const totalCreditos = data.reduce((sum, c) => sum + (c.creditos || 0), 0);
        const promedioCreditos = total > 0 ? (totalCreditos / total).toFixed(2) : 0;

        return {
            total,
            activos,
            inactivos,
            totalCreditos,
            promedioCreditos
        };
    }

    // Método para generar reporte personalizado
    async generateCustomReport() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Generar Reporte Personalizado';
        modalBody.innerHTML = `
            <form id="customReportForm">
                <div class="form-group">
                    <label class="form-label">Tipo de Reporte *</label>
                    <select name="tipo" class="form-select" required>
                        <option value="">Seleccionar tipo</option>
                        <option value="estudiantes">Estudiantes</option>
                        <option value="profesores">Profesores</option>
                        <option value="cursos">Cursos</option>
                        <option value="proyectos">Proyectos</option>
                        <option value="todos">Reporte Completo</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Formato de Exportación</label>
                    <select name="formato" class="form-select">
                        <option value="csv">CSV (Excel)</option>
                        <option value="json">JSON</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Incluir Estadísticas</label>
                    <select name="incluirStats" class="form-select">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha Desde</label>
                    <input type="date" name="fechaDesde" class="form-input">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha Hasta</label>
                    <input type="date" name="fechaHasta" class="form-input">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="reportes.closeModal()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-download"></i> Generar Reporte
                    </button>
                </div>
            </form>
        `;

        document.getElementById('customReportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCustomReport();
        });

        this.openModal();
    }

    async processCustomReport() {
        const form = document.getElementById('customReportForm');
        const formData = Utils.getFormData(form);
        
        if (!formData.tipo) {
            Utils.showNotification('Por favor selecciona un tipo de reporte', 'error');
            return;
        }

        try {
            Utils.showLoading();
            
            let data = [];
            let fileName = '';
            
            switch (formData.tipo) {
                case 'estudiantes':
                    data = await API.estudiantes.getAll();
                    fileName = 'reporte_estudiantes_personalizado';
                    break;
                case 'profesores':
                    data = await API.profesores.getAll();
                    fileName = 'reporte_profesores_personalizado';
                    break;
                case 'cursos':
                    data = await API.cursos.getAll();
                    fileName = 'reporte_cursos_personalizado';
                    break;
                case 'proyectos':
                    data = await API.proyectos.getAll();
                    fileName = 'reporte_proyectos_personalizado';
                    break;
                case 'todos':
                    const [estudiantes, profesores, cursos, proyectos] = await Promise.all([
                        API.estudiantes.getAll(),
                        API.profesores.getAll(),
                        API.cursos.getAll(),
                        API.proyectos.getAll()
                    ]);
                    
                    data = [
                        { Tipo: 'ESTUDIANTES' },
                        ...estudiantes,
                        {},
                        { Tipo: 'PROFESORES' },
                        ...profesores,
                        {},
                        { Tipo: 'CURSOS' },
                        ...cursos,
                        {},
                        { Tipo: 'PROYECTOS' },
                        ...proyectos
                    ];
                    fileName = 'reporte_completo';
                    break;
            }

            // Aplicar filtros de fecha si se especificaron
            if (formData.fechaDesde || formData.fechaHasta) {
                data = this.filterByDate(data, formData.fechaDesde, formData.fechaHasta);
            }

            // Exportar según el formato
            if (formData.formato === 'json') {
                this.exportJSON(data, `${fileName}_${Utils.formatDateOnly(new Date())}.json`);
            } else {
                Utils.exportToCSV(data, `${fileName}_${Utils.formatDateOnly(new Date())}.csv`);
            }

            this.closeModal();
            Utils.hideLoading();
            Utils.showNotification('Reporte personalizado generado correctamente', 'success');
            
        } catch (error) {
            console.error('Error generating custom report:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al generar el reporte personalizado', 'error');
        }
    }

    filterByDate(data, fechaDesde, fechaHasta) {
        // Implementar filtrado por fecha según el tipo de datos
        // Esto dependería de la estructura específica de cada tipo de dato
        return data; // Por ahora retornamos todos los datos
    }

    exportJSON(data, fileName) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    openModal() {
        document.getElementById('modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Método para programar reportes automáticos
    scheduleReports() {
        Utils.showNotification('Función de programación de reportes en desarrollo', 'info');
    }

    // Método para visualizar estadísticas
    showStatistics() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Estadísticas del Sistema';
        modalBody.innerHTML = `
            <div class="stats-container">
                <div class="loading-stats">
                    <i class="fas fa-spinner fa-spin"></i>
                    Cargando estadísticas...
                </div>
            </div>
        `;

        this.openModal();
        this.loadStatistics();
    }

    async loadStatistics() {
        try {
            const stats = await API.reportes.getDashboardStats();
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-user-graduate"></i></div>
                        <div class="stat-info">
                            <h4>${stats.totalEstudiantes}</h4>
                            <p>Total Estudiantes</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                        <div class="stat-info">
                            <h4>${stats.totalProfesores}</h4>
                            <p>Total Profesores</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-book"></i></div>
                        <div class="stat-info">
                            <h4>${stats.totalCursos}</h4>
                            <p>Total Cursos</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-project-diagram"></i></div>
                        <div class="stat-info">
                            <h4>${stats.totalProyectos}</h4>
                            <p>Total Proyectos</p>
                        </div>
                    </div>
                </div>
                
                <div class="stats-actions">
                    <button class="btn btn-primary" onclick="reportes.generateCustomReport()">
                        <i class="fas fa-file-alt"></i> Generar Reporte Personalizado
                    </button>
                </div>
            `;

            this.addStatsStyles();
            
        } catch (error) {
            console.error('Error loading statistics:', error);
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = '<div class="error-message">Error al cargar las estadísticas</div>';
        }
    }

    addStatsStyles() {
        if (document.getElementById('stats-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'stats-styles';
        styles.textContent = `
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--surface-color);
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
            }
            
            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 0.5rem;
                background: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }
            
            .stat-info h4 {
                font-size: 1.5rem;
                font-weight: 700;
                margin: 0;
                color: var(--text-primary);
            }
            
            .stat-info p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .stats-actions {
                text-align: center;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
            }
            
            .loading-stats {
                text-align: center;
                padding: 2rem;
                color: var(--text-secondary);
            }
            
            .error-message {
                text-align: center;
                padding: 2rem;
                color: var(--error-color);
            }
        `;
        document.head.appendChild(styles);
    }
}

const reportes = new ReportesManager();

window.generateEstudiantesReport = () => reportes.generateEstudiantesReport();
window.generateProfesoresReport = () => reportes.generateProfesoresReport();
window.generateCursosReport = () => reportes.generateCursosReport();
window.generateCustomReport = () => reportes.generateCustomReport();
window.showStatistics = () => reportes.showStatistics();
window.scheduleReports = () => reportes.scheduleReports();

window.Reportes = reportes;
