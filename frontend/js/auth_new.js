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
                        <h2 class="modal-title">Iniciar Sesión</h2>
                        <span class="close" onclick="authUI.closeLoginModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="warning-message login-required-notice">
                            <strong>⚠️ Acceso requerido</strong><br>
                            <small>Debe iniciar sesión para acceder al sistema.</small>
                        </div>
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="username">Usuario:</label>
                                <input type="text" id="username" name="username" required 
                                       placeholder="Ingrese su usuario" autocomplete="username" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="password">Contraseña:</label>
                                <input type="password" id="password" name="password" required 
                                       placeholder="Ingrese su contraseña" autocomplete="current-password" class="form-input">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Iniciar Sesión
                                </button>
                            </div>
                            <div id="loginError" class="error-message" style="display: none;"></div>
                        </form>
                        
                        <div class="login-help">
                            <h4>Credenciales de administrador:</h4>
                            <div class="credentials-info">
                                <div class="credential-item">
                                    <strong>Usuario:</strong> 
                                    <span class="credential-value">admin</span>
                                </div>
                                <div class="credential-item">
                                    <strong>Contraseña:</strong> 
                                    <span class="credential-value">admin123</span>
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
        
        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal) {
                this.closeLoginModal();
            }
            if (e.target === this.userMenuModal) {
                this.closeUserMenu();
            }
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        try {
            const result = await userAuthService.login(username, password);
            
            if (result.success) {
                this.closeLoginModal();
                this.showNotification('Inicio de sesión exitoso', 'success');
                // Limpiar el formulario
                document.getElementById('loginForm').reset();
                errorDiv.style.display = 'none';
            } else {
                errorDiv.textContent = result.message || 'Error al iniciar sesión';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error en login:', error);
            errorDiv.textContent = 'Error de conexión';
            errorDiv.style.display = 'block';
        }
    }
    
    updateUserButton(isAuthenticated, user) {
        const userButton = document.getElementById('usuario-button');
        if (!userButton) return;
        
        if (isAuthenticated && user) {
            userButton.textContent = `👤 ${user.fullName || user.username}`;
            userButton.onclick = () => this.showUserMenu();
            userButton.style.display = 'block';
            
            // Ocultar mensaje de login requerido si existe
            this.hideLoginRequiredMessage();
        } else {
            userButton.textContent = '👤 Usuario';
            userButton.onclick = () => this.showLoginModal();
            userButton.style.display = 'block';
            
            // Mostrar mensaje de login requerido
            this.showLoginRequiredMessage();
        }
    }
    
    showLoginModal() {
        if (this.loginModal) {
            this.loginModal.style.display = 'block';
            // Focus en el campo de usuario
            setTimeout(() => {
                const usernameField = document.getElementById('username');
                if (usernameField) {
                    usernameField.focus();
                }
            }, 100);
        }
    }
    
    closeLoginModal() {
        if (this.loginModal) {
            this.loginModal.style.display = 'none';
            // Limpiar errores
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }
    }
    
    showUserMenu() {
        if (this.userMenuModal) {
            // Actualizar información del usuario
            const user = userAuthService.getCurrentUser();
            const userInfo = document.getElementById('userInfo');
            
            if (user && userInfo) {
                userInfo.innerHTML = `
                    <div class="user-profile">
                        <h4>${user.fullName || user.username}</h4>
                        <p><strong>Usuario:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email || 'No especificado'}</p>
                        <p><strong>Rol:</strong> ${this.getRoleDisplayName(user.role)}</p>
                    </div>
                `;
            }
            
            this.userMenuModal.style.display = 'block';
        }
    }
    
    closeUserMenu() {
        if (this.userMenuModal) {
            this.userMenuModal.style.display = 'none';
        }
    }
    
    async logout() {
        try {
            await userAuthService.logout();
            this.closeUserMenu();
            this.showNotification('Sesión cerrada correctamente', 'success');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.showNotification('Error al cerrar sesión', 'error');
        }
    }
    
    getRoleDisplayName(role) {
        const roleNames = {
            'ADMIN': 'Administrador',
            'PROFESOR': 'Profesor',
            'ESTUDIANTE': 'Estudiante'
        };
        return roleNames[role] || role;
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        // Colores según el tipo
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    showLoginRequiredMessage() {
        // Mostrar mensaje persistente de que se requiere login
        const existingMessage = document.getElementById('loginRequiredBanner');
        if (existingMessage) return;
        
        const banner = document.createElement('div');
        banner.id = 'loginRequiredBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(245, 158, 11, 0.95);
            color: #000;
            text-align: center;
            padding: 10px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        banner.innerHTML = `
            ⚠️ Debe iniciar sesión para acceder al sistema completo
            <button onclick="authUI.showLoginModal()" style="margin-left: 10px; padding: 5px 10px; background: #000; color: #fff; border: none; border-radius: 3px; cursor: pointer;">
                Iniciar Sesión
            </button>
        `;
        
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Ajustar el padding del body para compensar el banner
        document.body.style.paddingTop = '50px';
    }
    
    hideLoginRequiredMessage() {
        const banner = document.getElementById('loginRequiredBanner');
        if (banner) {
            banner.remove();
            document.body.style.paddingTop = '0';
        }
    }
}

// Función global para compatibilidad
function toggleLogin() {
    if (window.authUI) {
        authUI.showLoginModal();
    }
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (!window.authUI) {
        window.authUI = new AuthUI();
    }
});

// También disponible globalmente
if (!window.authUI) {
    window.authUI = new AuthUI();
}
