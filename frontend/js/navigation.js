// Manejo de navegación
class NavigationManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.navItems = [];
        this.contentSections = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.setupMobileMenu();
            this.loadInitialSection();
        });
    }

    setupNavigation() {
        // Obtener elementos de navegación
        this.navItems = document.querySelectorAll('.nav-item');
        this.contentSections = document.querySelectorAll('.content-section');

        // Agregar event listeners
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });

        // Manejar navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const keyMap = {
                    '1': 'dashboard',
                    '2': 'estudiantes',
                    '3': 'profesores',
                    '4': 'cursos',
                    '5': 'proyectos',
                    '6': 'reportes'
                };

                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.navigateToSection(keyMap[e.key]);
                }
            }
        });

        // Manejar navegación del navegador (botones atrás/adelante)
        window.addEventListener('popstate', (e) => {
            const section = e.state?.section || 'dashboard';
            this.navigateToSection(section, false);
        });
    }

    navigateToSection(sectionName, updateHistory = true) {
        // Validar que la sección existe
        const targetSection = document.getElementById(sectionName);
        if (!targetSection) {
            console.warn(`Section "${sectionName}" not found`);
            return;
        }

        // Ocultar todas las secciones
        this.contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección objetivo
        targetSection.classList.add('active');

        // Actualizar navegación activa
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionName) {
                item.classList.add('active');
            }
        });

        // Actualizar estado actual
        this.currentSection = sectionName;

        // Actualizar URL y historial
        if (updateHistory) {
            const url = sectionName === 'dashboard' ? '/' : `/${sectionName}`;
            window.history.pushState({ section: sectionName }, '', url);
        }

        // Actualizar título de la página
        this.updatePageTitle(sectionName);

        // Cargar contenido de la sección si es necesario
        this.loadSectionContent(sectionName);

        // Cerrar menú móvil si está abierto
        this.closeMobileMenu();

        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('sectionChanged', {
            detail: { section: sectionName }
        }));

        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadInitialSection() {
        // Determinar sección inicial desde la URL
        const path = window.location.pathname;
        let initialSection = 'dashboard';

        if (path.startsWith('/estudiantes')) {
            initialSection = 'estudiantes';
        } else if (path.startsWith('/profesores')) {
            initialSection = 'profesores';
        } else if (path.startsWith('/cursos')) {
            initialSection = 'cursos';
        } else if (path.startsWith('/proyectos')) {
            initialSection = 'proyectos';
        } else if (path.startsWith('/reportes')) {
            initialSection = 'reportes';
        }

        this.navigateToSection(initialSection, false);
    }

    updatePageTitle(sectionName) {
        const titles = {
            dashboard: 'Dashboard - Sistema de Gestión Académica UTP',
            estudiantes: 'Estudiantes - Sistema de Gestión Académica UTP',
            profesores: 'Profesores - Sistema de Gestión Académica UTP',
            cursos: 'Cursos - Sistema de Gestión Académica UTP',
            proyectos: 'Proyectos - Sistema de Gestión Académica UTP',
            reportes: 'Reportes - Sistema de Gestión Académica UTP'
        };

        document.title = titles[sectionName] || 'Sistema de Gestión Académica UTP';
    }

    loadSectionContent(sectionName) {
        // Cargar datos específicos de cada sección
        switch (sectionName) {
            case 'dashboard':
                if (window.Dashboard && window.Dashboard.loadStats) {
                    window.Dashboard.loadStats();
                }
                break;
            case 'estudiantes':
                if (window.Estudiantes && window.Estudiantes.loadTable) {
                    window.Estudiantes.loadTable();
                }
                break;
            case 'profesores':
                if (window.Profesores && window.Profesores.loadTable) {
                    window.Profesores.loadTable();
                }
                break;
            case 'cursos':
                if (window.Cursos && window.Cursos.loadTable) {
                    window.Cursos.loadTable();
                }
                break;
            case 'proyectos':
                if (window.Proyectos && window.Proyectos.loadTable) {
                    window.Proyectos.loadTable();
                }
                break;
            case 'reportes':
                if (window.Reportes && window.Reportes.init) {
                    window.Reportes.init();
                }
                break;
        }
    }

    setupMobileMenu() {
        // Crear botón de menú móvil
        const header = document.querySelector('.header-content');
        if (!header) return;

        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.style.display = 'none';
        
        // Agregar al header
        header.insertBefore(menuButton, header.firstChild);

        // Event listener para el botón
        menuButton.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Agregar estilos para móvil
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 1024px) {
                .mobile-menu-button {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1.25rem;
                }
                
                .sidebar {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    z-index: 1001;
                }
                
                .sidebar.mobile-open {
                    transform: translateX(0);
                }
                
                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    display: none;
                }
                
                .mobile-overlay.active {
                    display: block;
                }
            }
        `;
        document.head.appendChild(mobileStyles);

        // Crear overlay para móvil
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        document.body.appendChild(overlay);
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            if (sidebar.classList.contains('mobile-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }

    // Método para agregar nuevas secciones dinámicamente
    addSection(sectionId, navLabel, navIcon) {
        // Crear elemento de navegación
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        navItem.dataset.section = sectionId;
        navItem.innerHTML = `
            <i class="${navIcon}"></i>
            <span>${navLabel}</span>
        `;

        // Agregar event listener
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToSection(sectionId);
        });

        // Agregar a la navegación
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.appendChild(navItem);
            this.navItems = document.querySelectorAll('.nav-item');
        }
    }

    // Método para eliminar secciones
    removeSection(sectionId) {
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        const contentSection = document.getElementById(sectionId);
        
        if (navItem) navItem.remove();
        if (contentSection) contentSection.remove();
        
        // Actualizar referencias
        this.navItems = document.querySelectorAll('.nav-item');
        this.contentSections = document.querySelectorAll('.content-section');
        
        // Si estamos en la sección eliminada, ir al dashboard
        if (this.currentSection === sectionId) {
            this.navigateToSection('dashboard');
        }
    }

    // Breadcrumb navigation
    createBreadcrumb(items) {
        const breadcrumb = document.querySelector('.breadcrumb') || this.createBreadcrumbElement();
        
        breadcrumb.innerHTML = items.map((item, index) => {
            const isLast = index === items.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${!isLast && item.link ? 
                        `<a href="#" onclick="navigationManager.navigateToSection('${item.link}')">${item.label}</a>` : 
                        item.label
                    }
                </span>
                ${!isLast ? '<span class="breadcrumb-separator">/</span>' : ''}
            `;
        }).join('');
    }

    createBreadcrumbElement() {
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        
        // Insertar después del header de sección
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.parentNode.insertBefore(breadcrumb, header.nextSibling);
        });
        
        // Agregar estilos
        const breadcrumbStyles = document.createElement('style');
        breadcrumbStyles.textContent = `
            .breadcrumb {
                margin-bottom: 1rem;
                padding: 0.75rem 0;
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            .breadcrumb-item a {
                color: var(--primary-color);
                text-decoration: none;
            }
            .breadcrumb-item a:hover {
                text-decoration: underline;
            }
            .breadcrumb-item.active {
                color: var(--text-primary);
                font-weight: 500;
            }
            .breadcrumb-separator {
                margin: 0 0.5rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(breadcrumbStyles);
        
        return breadcrumb;
    }
}

// Crear instancia global
const navigationManager = new NavigationManager();

// Funciones globales para compatibilidad
window.navigateToSection = (section) => navigationManager.navigateToSection(section);
window.getCurrentSection = () => navigationManager.getCurrentSection();
window.createBreadcrumb = (items) => navigationManager.createBreadcrumb(items);

// Exportar para uso global
window.NavigationManager = NavigationManager;
window.navigationManager = navigationManager;
