// Manejo de temas
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeSelect = null;
        this.init();
    }

    init() {
        // Aplicar tema guardado
        this.applyTheme(this.currentTheme);
        
        // Configurar selector de tema cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            this.setupThemeSelector();
        });
    }

    setupThemeSelector() {
        this.themeSelect = document.getElementById('themeSelect');
        if (!this.themeSelect) return;

        // Establecer valor actual
        this.themeSelect.value = this.currentTheme;

        // Escuchar cambios
        this.themeSelect.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
    }

    applyTheme(themeName) {
        // Remover tema anterior
        document.documentElement.removeAttribute('data-theme');
        
        // Aplicar nuevo tema
        if (themeName !== 'light') {
            document.documentElement.setAttribute('data-theme', themeName);
        }

        // Aplicar clases específicas para ciertos temas
        document.body.className = '';
        if (themeName === 'glass') {
            document.body.classList.add('glass-theme');
        } else if (themeName === 'neomorphism') {
            document.body.classList.add('neomorphism-theme');
        }

        this.currentTheme = themeName;
    }

    changeTheme(newTheme) {
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Notificar cambio
        Utils.showNotification(`Tema cambiado a: ${this.getThemeName(newTheme)}`, 'info');
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }

    getThemeName(theme) {
        const names = {
            light: 'Claro',
            dark: 'Oscuro',
            glass: 'Glassmorfismo',
            neomorphism: 'Neumorfismo'
        };
        return names[theme] || theme;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Alternar entre modo claro y oscuro
    toggleDarkMode() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.changeTheme(newTheme);
        if (this.themeSelect) {
            this.themeSelect.value = newTheme;
        }
    }

    // Detectar preferencia del sistema
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Usar tema del sistema
    useSystemTheme() {
        const systemTheme = this.detectSystemTheme();
        this.changeTheme(systemTheme);
        if (this.themeSelect) {
            this.themeSelect.value = systemTheme;
        }
    }

    // Escuchar cambios en las preferencias del sistema
    listenToSystemChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (localStorage.getItem('theme') === 'system') {
                    this.changeTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Animación suave al cambiar tema
    animateThemeChange() {
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    // Previsualizar tema temporalmente
    previewTheme(theme, duration = 3000) {
        const originalTheme = this.currentTheme;
        this.applyTheme(theme);
        
        setTimeout(() => {
            this.applyTheme(originalTheme);
        }, duration);
    }

    // Obtener todos los temas disponibles
    getAvailableThemes() {
        return [
            { value: 'light', name: 'Claro', icon: '☀️' },
            { value: 'dark', name: 'Oscuro', icon: '🌙' },
            { value: 'glass', name: 'Glassmorfismo', icon: '🔮' },
            { value: 'neomorphism', name: 'Neumorfismo', icon: '🎨' }
        ];
    }

    // Crear selector de tema mejorado
    createAdvancedThemeSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const themes = this.getAvailableThemes();
        
        container.innerHTML = `
            <div class="advanced-theme-selector">
                <h4>Seleccionar Tema</h4>
                <div class="theme-grid">
                    ${themes.map(theme => `
                        <div class="theme-option ${this.currentTheme === theme.value ? 'active' : ''}" 
                             data-theme="${theme.value}">
                            <div class="theme-preview" data-theme="${theme.value}">
                                <div class="theme-icon">${theme.icon}</div>
                                <div class="theme-name">${theme.name}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Agregar estilos
        if (!document.getElementById('advanced-theme-styles')) {
            const styles = document.createElement('style');
            styles.id = 'advanced-theme-styles';
            styles.textContent = `
                .advanced-theme-selector {
                    padding: 1rem;
                }
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .theme-option {
                    cursor: pointer;
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    border: 2px solid transparent;
                    transition: all 0.2s ease;
                }
                .theme-option:hover {
                    border-color: var(--primary-color);
                }
                .theme-option.active {
                    border-color: var(--primary-color);
                    background-color: rgba(37, 99, 235, 0.1);
                }
                .theme-preview {
                    text-align: center;
                    padding: 1rem;
                    border-radius: 0.375rem;
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                }
                .theme-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                .theme-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }

        // Agregar event listeners
        container.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.changeTheme(theme);
                
                // Actualizar visual
                container.querySelectorAll('.theme-option').forEach(opt => 
                    opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
}

// Crear instancia global del gestor de temas
const themeManager = new ThemeManager();

// Funciones globales para compatibilidad
window.changeTheme = (theme) => themeManager.changeTheme(theme);
window.toggleDarkMode = () => themeManager.toggleDarkMode();
window.useSystemTheme = () => themeManager.useSystemTheme();

// Event listeners adicionales
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + T para alternar tema
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        themeManager.toggleDarkMode();
    }
});

// Exportar para uso global
window.ThemeManager = ThemeManager;
window.themeManager = themeManager;
