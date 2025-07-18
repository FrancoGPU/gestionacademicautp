// Archivo principal de la aplicación
class App {
    constructor() {
        this.isInitialized = false;
        this.version = '1.0.0';
        this.init();
    }

    init() {
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Mostrar splash screen o loading inicial
            this.showInitialLoading();

            // Verificar compatibilidad del navegador
            this.checkBrowserCompatibility();

            // Configurar manejo de errores globales
            this.setupGlobalErrorHandling();

            // Inicializar componentes principales
            await this.initializeComponents();

            // Configurar event listeners globales
            this.setupGlobalEventListeners();

            // Verificar autenticación (si es necesario)
            // await this.checkAuthentication();

            // Cargar configuración de usuario
            this.loadUserPreferences();

            // Configurar eventos de modal global
            Utils.setupModalEvents();
            
            // Crear función global de cierre de modal
            window.closeModal = function() {
                Utils.closeModal();
            };

            // Finalizar inicialización
            this.finishInitialization();

            this.isInitialized = true;
            console.log(`Sistema de Gestión Académica UTP v${this.version} inicializado correctamente`);

        } catch (error) {
            console.error('Error during app initialization:', error);
            this.handleInitializationError(error);
        }
    }

    showInitialLoading() {
        // Crear overlay de carga inicial si no existe
        if (!document.getElementById('initial-loading')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'initial-loading';
            loadingOverlay.innerHTML = `
                <div class="initial-loading-content">
                    <img src="public/logo192.png" alt="UTP Logo" class="loading-logo">
                    <h2>Sistema de Gestión Académica UTP</h2>
                    <div class="loading-spinner"></div>
                    <p>Inicializando sistema...</p>
                </div>
            `;
            
            // Agregar estilos
            const styles = document.createElement('style');
            styles.textContent = `
                #initial-loading {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .initial-loading-content {
                    text-align: center;
                    animation: fadeIn 0.5s ease;
                }
                
                .loading-logo {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 1rem;
                    animation: pulse 2s infinite;
                }
                
                .initial-loading-content h2 {
                    margin-bottom: 2rem;
                    font-weight: 300;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                
                .initial-loading-content p {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
            document.body.appendChild(loadingOverlay);
        }
    }

    hideInitialLoading() {
        const loadingOverlay = document.getElementById('initial-loading');
        if (loadingOverlay) {
            loadingOverlay.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
            
            // Agregar animación de salida
            const fadeOutStyles = document.createElement('style');
            fadeOutStyles.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.9); }
                }
            `;
            document.head.appendChild(fadeOutStyles);
        }
    }

    checkBrowserCompatibility() {
        const isSupported = 
            'fetch' in window &&
            'Promise' in window &&
            'localStorage' in window &&
            'addEventListener' in window;

        if (!isSupported) {
            this.showBrowserCompatibilityWarning();
        }

        // Detectar navegador
        const userAgent = navigator.userAgent;
        let browserInfo = 'Desconocido';
        
        if (userAgent.includes('Chrome')) browserInfo = 'Chrome';
        else if (userAgent.includes('Firefox')) browserInfo = 'Firefox';
        else if (userAgent.includes('Safari')) browserInfo = 'Safari';
        else if (userAgent.includes('Edge')) browserInfo = 'Edge';

        console.log(`Navegador detectado: ${browserInfo}`);
    }

    showBrowserCompatibilityWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #f59e0b;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10001;
            font-weight: 500;
        `;
        warning.textContent = 'Tu navegador podría no ser completamente compatible. Te recomendamos usar Chrome, Firefox, Safari o Edge.';
        document.body.appendChild(warning);
    }

    setupGlobalErrorHandling() {
        // Manejar errores JavaScript no capturados
        window.addEventListener('error', (event) => {
            console.error('Error no capturado:', event.error);
            this.handleGlobalError(event.error);
        });

        // Manejar promesas rechazadas no capturadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promesa rechazada no capturada:', event.reason);
            this.handleGlobalError(event.reason);
        });
    }

    handleGlobalError(error) {
        // Log del error
        console.error('Error global:', error);
        
        // Mostrar notificación de error si Utils está disponible
        if (window.Utils && window.Utils.showNotification) {
            Utils.showNotification('Ha ocurrido un error inesperado. Por favor, recarga la página.', 'error');
        }
        
        // Enviar error a servicio de logging (si está configurado)
        this.logError(error);
    }

    logError(error) {
        // Aquí podrías enviar el error a un servicio de logging como Sentry
        const errorData = {
            message: error.message || 'Error desconocido',
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // Por ahora solo guardamos en localStorage para debug
        try {
            const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
            errors.push(errorData);
            
            // Mantener solo los últimos 10 errores
            if (errors.length > 10) {
                errors.shift();
            }
            
            localStorage.setItem('app_errors', JSON.stringify(errors));
        } catch (e) {
            console.warn('No se pudo guardar el error en localStorage:', e);
        }
    }

    async initializeComponents() {
        // Los componentes se inicializan automáticamente con sus constructores
        // Aquí podemos hacer validaciones adicionales
        
        const components = [
            'Utils',
            'API',
            'themeManager',
            'navigationManager',
            'Dashboard',
            'Estudiantes',
            'Profesores',
            'Cursos',
            'Proyectos',
            'Reportes'
        ];

        components.forEach(component => {
            if (!window[component]) {
                console.warn(`Componente ${component} no está disponible`);
            }
        });
    }

    setupGlobalEventListeners() {
        // Manejar cambios de conectividad
        window.addEventListener('online', () => {
            Utils.showNotification('Conexión a internet restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('Sin conexión a internet', 'warning');
        });

        // Manejar cambios de visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Aplicación en segundo plano');
            } else {
                console.log('Aplicación en primer plano');
                // Revalidar datos si es necesario
                this.refreshCurrentSection();
            }
        });

        // Atajos de teclado globales
        document.addEventListener('keydown', (e) => {
            // Ctrl + / para mostrar ayuda
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
            
            // F5 para recargar datos
            if (e.key === 'F5') {
                e.preventDefault();
                this.refreshCurrentSection();
            }
        });

        // Configurar cierre del modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('modal');
                if (modal && modal.style.display === 'block') {
                    if (window.closeModal) {
                        window.closeModal();
                    } else {
                        modal.style.display = 'none';
                    }
                }
            }
        });
    }

    refreshCurrentSection() {
        const currentSection = navigationManager.getCurrentSection();
        
        switch (currentSection) {
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
        }
    }

    showKeyboardShortcuts() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Atajos de Teclado';
        modalBody.innerHTML = `
            <div class="shortcuts-container">
                <h4>Navegación</h4>
                <ul class="shortcuts-list">
                    <li><kbd>Alt + 1</kbd> Dashboard</li>
                    <li><kbd>Alt + 2</kbd> Estudiantes</li>
                    <li><kbd>Alt + 3</kbd> Profesores</li>
                    <li><kbd>Alt + 4</kbd> Cursos</li>
                    <li><kbd>Alt + 5</kbd> Proyectos</li>
                    <li><kbd>Alt + 6</kbd> Reportes</li>
                </ul>
                
                <h4>Generales</h4>
                <ul class="shortcuts-list">
                    <li><kbd>Ctrl + Shift + T</kbd> Cambiar tema</li>
                    <li><kbd>F5</kbd> Actualizar datos</li>
                    <li><kbd>Esc</kbd> Cerrar modal</li>
                    <li><kbd>Ctrl + /</kbd> Mostrar ayuda</li>
                </ul>
            </div>
        `;

        // Agregar estilos para los atajos
        if (!document.getElementById('shortcuts-styles')) {
            const styles = document.createElement('style');
            styles.id = 'shortcuts-styles';
            styles.textContent = `
                .shortcuts-container h4 {
                    margin: 1rem 0 0.5rem 0;
                    color: var(--text-primary);
                }
                
                .shortcuts-container h4:first-child {
                    margin-top: 0;
                }
                
                .shortcuts-list {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 1.5rem;
                }
                
                .shortcuts-list li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .shortcuts-list li:last-child {
                    border-bottom: none;
                }
                
                kbd {
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                    border-radius: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }

        document.getElementById('modal').style.display = 'block';
    }

    loadUserPreferences() {
        // Cargar preferencias guardadas
        const preferences = {
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'es',
            autoSave: localStorage.getItem('autoSave') !== 'false',
            notifications: localStorage.getItem('notifications') !== 'false'
        };

        // Aplicar tema guardado (ya se hace en ThemeManager)
        
        // Aplicar otras preferencias
        this.preferences = preferences;
    }

    saveUserPreference(key, value) {
        localStorage.setItem(key, value);
        this.preferences[key] = value;
    }

    async checkAuthentication() {
        // La autenticación ahora es manejada por el sistema UserAuthService
        // No es necesario hacer nada aquí por ahora
    }

    finishInitialization() {
        // Ocultar loading inicial
        setTimeout(() => {
            this.hideInitialLoading();
        }, 1500); // Dar tiempo para que se vea el loading

        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            Utils.showNotification('¡Bienvenido al Sistema de Gestión Académica UTP!', 'success');
        }, 2000);

        // Configurar auto-guardado si está habilitado
        if (this.preferences.autoSave) {
            this.setupAutoSave();
        }
    }

    setupAutoSave() {
        // Implementar auto-guardado si es necesario
        console.log('Auto-guardado habilitado');
    }

    handleInitializationError(error) {
        this.hideInitialLoading();
        
        // Mostrar mensaje de error
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                padding: 2rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                text-align: center;
                z-index: 10000;
            ">
                <div style="color: #ef4444; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="margin-bottom: 1rem; color: #1e293b;">Error de Inicialización</h3>
                <p style="margin-bottom: 1.5rem; color: #64748b;">
                    No se pudo inicializar la aplicación correctamente.
                </p>
                <button onclick="window.location.reload()" style="
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    Recargar Página
                </button>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }

    // Métodos de utilidad
    getVersion() {
        return this.version;
    }

    getPreferences() {
        return this.preferences;
    }

    showAbout() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Acerca del Sistema';
        modalBody.innerHTML = `
            <div class="about-container">
                <div class="about-logo">
                    <img src="public/logo192.png" alt="UTP Logo" style="width: 80px; height: 80px;">
                </div>
                <h3>Sistema de Gestión Académica UTP</h3>
                <p><strong>Versión:</strong> ${this.version}</p>
                <p><strong>Desarrollado para:</strong> Universidad Tecnológica del Perú</p>
                <p><strong>Tecnologías:</strong> HTML5, CSS3, JavaScript ES6+</p>
                <p><strong>Navegador:</strong> ${navigator.userAgent.split(' ')[0]}</p>
                <p style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.875rem;">
                    Sistema integral para la gestión de estudiantes, profesores, cursos y proyectos académicos.
                </p>
            </div>
        `;

        // Agregar estilos para el about
        if (!document.getElementById('about-styles')) {
            const styles = document.createElement('style');
            styles.id = 'about-styles';
            styles.textContent = `
                .about-container {
                    text-align: center;
                }
                
                .about-logo {
                    margin-bottom: 1rem;
                }
                
                .about-container h3 {
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }
                
                .about-container p {
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                }
            `;
            document.head.appendChild(styles);
        }

        document.getElementById('modal').style.display = 'block';
    }
}

// Crear e inicializar la aplicación
const app = new App();

// Exportar funciones globales útiles
window.app = app;
window.showAbout = () => app.showAbout();
window.showKeyboardShortcuts = () => app.showKeyboardShortcuts();
window.refreshCurrentSection = () => app.refreshCurrentSection();

// Event listener para cuando todos los scripts se hayan cargado
window.addEventListener('load', () => {
    console.log('Todos los recursos de la aplicación han sido cargados');
});

// Configurar service worker si está disponible (para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}
