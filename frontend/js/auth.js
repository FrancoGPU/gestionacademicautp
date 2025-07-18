// auth.js - Manejo de autenticación en el frontend
class AuthUI {
    constructor() {
        this.loginModal = null;
        this.userMenuModal = null;
        this.createLoginModal();
        this.createUserMenu();
        this.setupEventListeners();
        
        // Escuchar cambios de autenticación
        userAuthService.onAuthChange((isAuthenticated, user) => {
            this.updateUserButton(isAuthenticated, user);
        });
    }
    
    createLoginModal() {
        const modalHTML = `
            <div id="loginModal" class="modal" style="display: none;">
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>Iniciar Sesión</h2>
                        <span class="close" onclick="authUI.closeLoginModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="login-required-notice" style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #2196f3;">
                            <strong>⚠️ Acceso requerido</strong><br>
                            <small>Debe iniciar sesión para acceder al sistema.</small>
                        </div>
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="username">Usuario:</label>
                                <input type="text" id="username" name="username" required 
                                       placeholder="Ingrese su usuario" autocomplete="username">
                            </div>
                            <div class="form-group">
                                <label for="password">Contraseña:</label>
                                <input type="password" id="password" name="password" required 
                                       placeholder="Ingrese su contraseña" autocomplete="current-password">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Iniciar Sesión
                                </button>
                            </div>
                            <div id="loginError" class="error-message" style="display: none;"></div>
                        </form>
                        
                        <div class="login-help" style="margin-top: 20px; font-size: 0.9em;">
                            <h4 style="color: #333; margin-bottom: 10px;">Credenciales de administrador:</h4>
                            <div style="background: linear-gradient(145deg, #e3f2fd, #f8f9fa); padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="margin-bottom: 8px;">
                                    <strong style="color: #1976d2;">Usuario:</strong> 
                                    <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px; border: 1px solid #ddd;">admin</span>
                                </div>
                                <div>
                                    <strong style="color: #1976d2;">Contraseña:</strong> 
                                    <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px; border: 1px solid #ddd;">admin123</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.loginModal = document.getElementById('loginModal');
    }
    
    createUserMenu() {
        const menuHTML = `
            <div id="userMenuModal" class="modal" style="display: none;">
                <div class="modal-content" style="max-width: 300px;">
                    <div class="modal-header">
                        <h3>Menú de Usuario</h3>
                        <span class="close" onclick="authUI.closeUserMenu()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div id="userInfo" class="user-info">
                            <!-- Se llenará dinámicamente -->
                        </div>
                        <div class="user-actions">
                            <button onclick="authUI.showProfile()" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px;">
                                Ver Perfil
                            </button>
                            <button onclick="authUI.logout()" class="btn btn-danger" style="width: 100%;">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        this.userMenuModal = document.getElementById('userMenuModal');
    }
    
    setupEventListeners() {
        // Evento del formulario de login
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Cerrar modales al hacer clic fuera (solo si está autenticado)
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal && userAuthService.isAuthenticated) {
                this.closeLoginModal();
            }
            if (e.target === this.userMenuModal) {
                this.closeUserMenu();
            }
        });
        
        // Esc para cerrar modales (solo si está autenticado para el login modal)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (userAuthService.isAuthenticated) {
                    this.closeLoginModal();
                }
                this.closeUserMenu();
            }
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        // Limpiar errores previos
        errorDiv.style.display = 'none';
        
        // Deshabilitar botón durante login
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando...';
        
        try {
            const result = await userAuthService.login(username, password);
            
            if (result.success) {
                this.closeLoginModal();
                this.showNotification('¡Bienvenido! Sesión iniciada correctamente.', 'success');
            } else {
                errorDiv.textContent = result.message || 'Credenciales inválidas';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión. Intente nuevamente.';
            errorDiv.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    updateUserButton(isAuthenticated, user) {
        const userButton = document.getElementById('usuario-button');
        if (!userButton) return;
        
        // Controlar visibilidad del contenido principal
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.querySelector('.sidebar');
        
        if (isAuthenticated && user) {
            userButton.textContent = user.fullName || user.username;
            userButton.onclick = () => this.showUserMenu();
            userButton.style.backgroundColor = '#28a745';
            userButton.title = `Conectado como: ${user.fullName} (${user.role})`;
            
            // Mostrar contenido principal y ocultar mensaje de login
            if (mainContent) mainContent.style.display = 'block';
            if (sidebar) sidebar.style.display = 'block';
            this.hideLoginRequiredMessage();
            
        } else {
            userButton.textContent = 'Usuario';
            userButton.onclick = () => this.showLoginModal();
            userButton.style.backgroundColor = '';
            userButton.title = 'Hacer clic para iniciar sesión';
            
            // Ocultar contenido principal y mostrar mensaje de login requerido
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            if (sidebar) {
                sidebar.style.display = 'none';
            }
            
            // Crear mensaje de login requerido si no existe
            this.showLoginRequiredMessage();
        }
    }
    
    showLoginModal() {
        this.loginModal.style.display = 'block';
        document.getElementById('username').focus();
        
        // Limpiar formulario
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').style.display = 'none';
        
        // Ocultar botón de cerrar si no hay sesión activa
        const closeButton = this.loginModal.querySelector('.close');
        if (!userAuthService.isAuthenticated) {
            closeButton.style.display = 'none';
        } else {
            closeButton.style.display = 'block';
        }
    }
    
    closeLoginModal() {
        // Solo permitir cerrar el modal si el usuario está autenticado
        if (userAuthService.isAuthenticated) {
            this.loginModal.style.display = 'none';
        } else {
            // Si no está autenticado, mostrar mensaje y mantener modal abierto
            this.showNotification('Debe iniciar sesión para continuar.', 'warning');
        }
    }
    
    showUserMenu() {
        const user = userAuthService.getCurrentUser();
        if (!user) return;
        
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-name">${user.fullName}</div>
                <div class="user-role">${this.getRoleDisplayName(user.role)}</div>
                <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">
                    @${user.username}
                </div>
                ${user.email ? `<div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 5px;">${user.email}</div>` : ''}
            </div>
        `;
        
        this.userMenuModal.style.display = 'block';
    }
    
    closeUserMenu() {
        this.userMenuModal.style.display = 'none';
    }
    
    async logout() {
        try {
            await userAuthService.logout();
            this.closeUserMenu();
            this.showNotification('Sesión cerrada correctamente.', 'info');
        } catch (error) {
            // Incluso si hay error, la sesión se cierra localmente
            this.closeUserMenu();
            this.showNotification('Sesión cerrada correctamente.', 'info');
        }
    }
    
    showProfile() {
        // Implementar vista de perfil en el futuro
        this.closeUserMenu();
        this.showNotification('Función de perfil próximamente disponible.', 'info');
    }
    
    getRoleDisplayName(role) {
        const roles = {
            'ADMIN': 'Administrador',
            'USER': 'Usuario',
            'PROFESSOR': 'Profesor'
        };
        return roles[role] || role;
    }
    
    showNotification(message, type = 'info') {
        // Reutilizar el sistema de notificaciones existente si existe
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Sistema de notificaciones simple
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showLoginRequiredMessage() {
        // Eliminar mensaje existente si hay uno
        this.hideLoginRequiredMessage();
        
        const message = document.createElement('div');
        message.id = 'loginRequiredMessage';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #2196f3, #1976d2);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 999;
            font-family: inherit;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        message.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 1.5em;">🔐 Acceso Restringido</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">Debe iniciar sesión para acceder al Sistema Académico UTP</p>
            <button onclick="authUI.showLoginModal()" style="
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1em;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                Iniciar Sesión
            </button>
        `;
        
        document.body.appendChild(message);
    }
    
    hideLoginRequiredMessage() {
        const message = document.getElementById('loginRequiredMessage');
        if (message) {
            message.remove();
        }
    }
}

// Instancia global del UI de autenticación
const authUI = new AuthUI();

// Función global para usar desde el HTML
function toggleLogin() {
    if (userAuthService.isUserAuthenticated()) {
        authUI.showUserMenu();
    } else {
        authUI.showLoginModal();
    }
}
