// authService.js - Servicio de autenticación
class UserAuthService {
    constructor() {
        this.API_BASE = 'http://localhost:8080/api/auth';
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authCallbacks = [];
        
        // No verificar sesión automáticamente en el constructor
        // Se hará en initFromStorage
    }
    
    async login(username, password) {
        try {
            const response = await fetch(`${this.API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = {
                    username: data.username,
                    fullName: data.fullName,
                    role: data.role,
                    sessionId: data.sessionId
                };
                this.isAuthenticated = true;
                
                // Guardar en localStorage para persistencia
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                
                this.notifyAuthChange();
                return { success: true, user: this.currentUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }
    
    async logout() {
        try {
            const response = await fetch(`${this.API_BASE}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            // Limpiar estado local independientemente de la respuesta del servidor
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            
            this.notifyAuthChange();
            
            // Siempre retornar éxito si se limpió el estado local
            return true;
        } catch (error) {
            console.error('Error en logout:', error);
            // Limpiar estado local incluso si hay error de conexión
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            this.notifyAuthChange();
            // Retornar éxito porque el estado local se limpió correctamente
            return true;
        }
    }
    
    async checkSession() {
        console.log('🔍 Verificando sesión con servidor...');
        try {
            const response = await fetch(`${this.API_BASE}/me`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Session check failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📡 Respuesta del servidor:', data);
            
            if (data.authenticated) {
                console.log('✅ Sesión válida en servidor para:', data.username);
                // Solo actualizar si no tenemos usuario o si cambió algo
                if (!this.currentUser || this.currentUser.username !== data.username) {
                    this.currentUser = {
                        username: data.username,
                        fullName: data.fullName,
                        email: data.email,
                        role: data.role
                    };
                    this.isAuthenticated = true;
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                    this.notifyAuthChange();
                    console.log('🔄 Estado actualizado con datos del servidor');
                }
            } else {
                console.log('❌ Servidor dice que no hay sesión válida');
                // Solo limpiar si actualmente creemos que estamos autenticados
                if (this.isAuthenticated) {
                    console.log('🧹 Limpiando estado local...');
                    this.currentUser = null;
                    this.isAuthenticated = false;
                    localStorage.removeItem('user');
                    this.notifyAuthChange();
                }
            }
            
            return this.isAuthenticated;
        } catch (error) {
            console.error('❌ Error verificando sesión:', error);
            // No limpiar el estado si es solo un error de red
            // Solo limpiar si teníamos una sesión activa y falló la verificación
            if (this.isAuthenticated) {
                console.log('🔌 Manteniendo sesión local debido a error de conexión');
            }
            return this.isAuthenticated;
        }
    }
    
    // Verificación silenciosa que no afecta la UI si hay errores de red
    async checkSessionSilently() {
        console.log('🤫 Verificación silenciosa de sesión...');
        try {
            const response = await fetch(`${this.API_BASE}/me`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    console.log('✅ Sesión confirmada silenciosamente');
                } else {
                    console.log('❌ Servidor confirma que no hay sesión válida');
                    this.currentUser = null;
                    this.isAuthenticated = false;
                    localStorage.removeItem('user');
                    this.notifyAuthChange();
                }
            } else {
                console.log('⚠️ Error en verificación silenciosa, manteniendo estado actual');
            }
        } catch (error) {
            console.log('⚠️ Error de red en verificación silenciosa, manteniendo estado actual');
        }
    }
    
    async renewSession() {
        try {
            const response = await fetch(`${this.API_BASE}/renew`, {
                method: 'POST',
                credentials: 'include'
            });
            
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error renovando sesión:', error);
            return false;
        }
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
    
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
    
    canAccess(requiredRoles) {
        if (!this.isAuthenticated) return false;
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return requiredRoles.includes(this.currentUser.role);
    }
    
    // Sistema de callbacks para notificar cambios de autenticación
    onAuthChange(callback) {
        this.authCallbacks.push(callback);
    }
    
    removeAuthCallback(callback) {
        this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
    }
    
    notifyAuthChange() {
        this.authCallbacks.forEach(callback => {
            try {
                callback(this.isAuthenticated, this.currentUser);
            } catch (error) {
                console.error('Error en callback de autenticación:', error);
            }
        });
    }
    
    // Utilidad para inicializar desde localStorage (para recarga de página)
    initFromStorage() {
        console.log('🔄 Inicializando autenticación desde localStorage...');
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                console.log('✅ Usuario encontrado en localStorage:', user.username);
                this.currentUser = user;
                this.isAuthenticated = true;
                this.notifyAuthChange();
                
                // Verificar que la sesión sigue siendo válida en segundo plano
                setTimeout(() => {
                    console.log('🔍 Verificando sesión en servidor...');
                    this.checkSessionSilently();
                }, 2000); // Aumentar tiempo de espera
            } catch (error) {
                console.error('❌ Error cargando usuario del storage:', error);
                localStorage.removeItem('user');
            }
        } else {
            console.log('❌ No hay usuario en localStorage, verificando servidor...');
            // Si no hay usuario en localStorage, verificar si hay sesión en el servidor
            this.checkSession();
        }
    }
}

// Instancia global del servicio de autenticación
const userAuthService = new UserAuthService();

// Auto-inicializar desde localStorage si existe y requerir login si no hay sesión
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, inicializando autenticación...');
    userAuthService.initFromStorage();
    
    // Dar tiempo suficiente para que la verificación de sesión se complete
    setTimeout(() => {
        console.log('⏰ Verificando estado final de autenticación...');
        console.log('Estado actual:', userAuthService.isAuthenticated ? 'Autenticado' : 'No autenticado');
        
        if (!userAuthService.isAuthenticated) {
            console.log('🔐 Mostrando modal de login...');
            // Asegurar que el modal de login se muestre
            if (window.authUI) {
                authUI.showLoginModal();
            } else {
                // Si authUI no está listo, esperar un poco más
                setTimeout(() => {
                    if (window.authUI && !userAuthService.isAuthenticated) {
                        authUI.showLoginModal();
                    }
                }, 1000);
            }
        } else {
            console.log('✅ Usuario ya autenticado, no se requiere modal');
        }
    }, 3000); // Dar 3 segundos para verificaciones
});
