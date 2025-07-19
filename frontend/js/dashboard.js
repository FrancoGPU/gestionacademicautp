// Manejo del Dashboard
class Dashboard {
    constructor() {
        this.stats = {
            totalEstudiantes: 0,
            totalProfesores: 0,
            totalCursos: 0,
            totalProyectos: 0
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadStats();
            this.setupRefreshButton();
        });

        // Escuchar eventos de cambio de sección
        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'dashboard') {
                this.loadStats();
            }
        });
    }

    async loadStats() {
        try {
            Utils.showLoading();
            
            // Cargar estadísticas desde la API
            const data = await API.reportes.getDashboardStats();
            
            this.stats = {
                totalEstudiantes: data.totalEstudiantes || 0,
                totalProfesores: data.totalProfesores || 0,
                totalCursos: data.totalCursos || 0,
                totalProyectos: data.totalProyectos || 0
            };

            this.updateStatsDisplay();
            this.loadRecentActivity();
            
            Utils.hideLoading();
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            Utils.hideLoading();
            Utils.showNotification('Error al cargar las estadísticas del dashboard', 'error');
        }
    }

    updateStatsDisplay() {
        // Actualizar contadores con animación
        this.animateCounter('totalEstudiantes', this.stats.totalEstudiantes);
        this.animateCounter('totalProfesores', this.stats.totalProfesores);
        this.animateCounter('totalCursos', this.stats.totalCursos);
        this.animateCounter('totalProyectos', this.stats.totalProyectos);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1500; // 1.5 segundos
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Función de easing para suavizar la animación
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    }

    async loadRecentActivity() {
        try {
            // Cargar actividad reciente (últimos estudiantes, cursos, etc.)
            const recentData = await this.getRecentActivity();
            this.displayRecentActivity(recentData);
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    async getRecentActivity() {
        // Obtener datos reales de las APIs
        try {
            const [estudiantes, profesores, cursos, proyectos] = await Promise.all([
                API.estudiantes.getAll(),
                API.profesores.getAll(),
                API.cursos.getAll(),
                API.proyectos.getAll()
            ]);

            return {
                recentStudents: estudiantes.slice(0, 5),
                recentProfessors: profesores.filter(p => p.activo).slice(0, 5),
                recentCourses: cursos.slice(0, 5),
                recentProjects: proyectos.slice(0, 5)
            };
        } catch (error) {
            console.error('Error loading recent activity:', error);
            return {
                recentStudents: [],
                recentProfessors: [],
                recentCourses: [],
                recentProjects: []
            };
        }
    }

    displayRecentActivity(data) {
        // Agregar sección de actividad reciente al dashboard
        const dashboardSection = document.getElementById('dashboard');
        
        // Verificar si ya existe la sección
        let activitySection = dashboardSection.querySelector('.recent-activity');
        if (!activitySection) {
            activitySection = document.createElement('div');
            activitySection.className = 'recent-activity';
            dashboardSection.appendChild(activitySection);
        }

        activitySection.innerHTML = `
            <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">Actividad Reciente</h3>
            <div class="activity-grid">
                <div class="card activity-card">
                    <h4><i class="fas fa-user-graduate"></i> Últimos Estudiantes</h4>
                    <ul class="activity-list">
                        ${data.recentStudents.map(student => `
                            <li>
                                <span class="activity-name">${student.nombre || 'Sin nombre'} ${student.apellido || ''}</span>
                                <span class="activity-meta">${student.correo || 'Sin correo'}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <a href="#" onclick="navigationManager.navigateToSection('estudiantes')" class="activity-link">
                        Ver todos <i class="fas fa-arrow-right"></i>
                    </a>
                </div>

                <div class="card activity-card">
                    <h4><i class="fas fa-chalkboard-teacher"></i> Profesores Activos</h4>
                    <ul class="activity-list">
                        ${data.recentProfessors.map(profesor => `
                            <li>
                                <span class="activity-name">${profesor.nombre || 'Sin nombre'} ${profesor.apellido || ''}</span>
                                <span class="activity-meta">${profesor.especialidad || 'Sin especialidad'}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <a href="#" onclick="navigationManager.navigateToSection('profesores')" class="activity-link">
                        Ver todos <i class="fas fa-arrow-right"></i>
                    </a>
                </div>

                <div class="card activity-card">
                    <h4><i class="fas fa-book"></i> Últimos Cursos</h4>
                    <ul class="activity-list">
                        ${data.recentCourses.map(course => `
                            <li>
                                <span class="activity-name">${course.nombre || 'Sin nombre'}</span>
                                <span class="activity-meta">${course.codigo || 'Sin código'} - ${course.creditos || 0} créditos</span>
                            </li>
                        `).join('')}
                    </ul>
                    <a href="#" onclick="navigationManager.navigateToSection('cursos')" class="activity-link">
                        Ver todos <i class="fas fa-arrow-right"></i>
                    </a>
                </div>

                <div class="card activity-card">
                    <h4><i class="fas fa-project-diagram"></i> Últimos Proyectos</h4>
                    <ul class="activity-list">
                        ${data.recentProjects.map(project => `
                            <li>
                                <span class="activity-name">${project.titulo}</span>
                                <span class="activity-meta">${project.resumen && project.resumen.length > 50 ? 
                                    project.resumen.substring(0, 50) + '...' : 
                                    project.resumen || 'Sin descripción'}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <a href="#" onclick="navigationManager.navigateToSection('proyectos')" class="activity-link">
                        Ver todos <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        // Agregar estilos para la actividad reciente
        this.addActivityStyles();
    }

    addActivityStyles() {
        if (document.getElementById('dashboard-activity-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'dashboard-activity-styles';
        styles.textContent = `
            .recent-activity {
                margin-top: 2rem;
            }
            
            .activity-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            
            .activity-card h4 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                color: var(--text-primary);
                font-size: 1rem;
            }
            
            .activity-list {
                list-style: none;
                padding: 0;
                margin: 0 0 1rem 0;
            }
            
            .activity-list li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .activity-list li:last-child {
                border-bottom: none;
            }
            
            .activity-name {
                font-weight: 500;
                color: var(--text-primary);
            }
            
            .activity-meta {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .activity-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--primary-color);
                text-decoration: none;
                font-size: 0.875rem;
                font-weight: 500;
                transition: color 0.2s ease;
            }
            
            .activity-link:hover {
                color: #1d4ed8;
            }
            
            .activity-link i {
                font-size: 0.75rem;
                transition: transform 0.2s ease;
            }
            
            .activity-link:hover i {
                transform: translateX(2px);
            }
        `;
        document.head.appendChild(styles);
    }

    setupRefreshButton() {
        // Agregar botón de actualizar al header del dashboard
        const dashboardHeader = document.querySelector('#dashboard .section-header');
        if (!dashboardHeader) return;

        const refreshButton = document.createElement('button');
        refreshButton.className = 'btn btn-secondary btn-small';
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        refreshButton.onclick = () => this.refresh();

        dashboardHeader.appendChild(refreshButton);
    }

    async refresh() {
        Utils.showNotification('Actualizando dashboard...', 'info');
        await this.loadStats();
        Utils.showNotification('Dashboard actualizado', 'success');
    }

    // Método para agregar widgets personalizados
    addWidget(widgetId, widgetContent, position = 'bottom') {
        const dashboardSection = document.getElementById('dashboard');
        const widget = document.createElement('div');
        widget.id = widgetId;
        widget.className = 'dashboard-widget card';
        widget.innerHTML = widgetContent;

        if (position === 'top') {
            const dashboardGrid = dashboardSection.querySelector('.dashboard-grid');
            dashboardSection.insertBefore(widget, dashboardGrid);
        } else {
            dashboardSection.appendChild(widget);
        }
    }

    // Método para eliminar widgets
    removeWidget(widgetId) {
        const widget = document.getElementById(widgetId);
        if (widget) {
            widget.remove();
        }
    }

    // Exportar datos del dashboard
    exportDashboardData() {
        const currentUser = userAuthService.getCurrentUser();
        const data = {
            estadisticas: this.stats,
            fechaExportacion: new Date().toISOString(),
            usuario: currentUser ? currentUser.fullName : 'Anónimo'
        };

        Utils.exportToCSV([data], `dashboard_${Utils.formatDateOnly(new Date())}.csv`);
        Utils.showNotification('Datos del dashboard exportados', 'success');
    }

    // Obtener configuración del dashboard
    getDashboardConfig() {
        return {
            autoRefresh: localStorage.getItem('dashboard_auto_refresh') === 'true',
            refreshInterval: parseInt(localStorage.getItem('dashboard_refresh_interval')) || 300000, // 5 minutos
            showRecentActivity: localStorage.getItem('dashboard_show_recent_activity') !== 'false'
        };
    }

    // Configurar auto-refresh
    setupAutoRefresh() {
        const config = this.getDashboardConfig();
        
        if (config.autoRefresh) {
            setInterval(() => {
                if (navigationManager.getCurrentSection() === 'dashboard') {
                    this.loadStats();
                }
            }, config.refreshInterval);
        }
    }
}

// Crear instancia global
const dashboard = new Dashboard();

// Funciones globales
window.refreshDashboard = () => dashboard.refresh();
window.exportDashboardData = () => dashboard.exportDashboardData();

// Exportar para uso global
window.Dashboard = dashboard;
