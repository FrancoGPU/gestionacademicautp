// authService.js - Servicio de autenticación
class UserAuthService {
    constructor() {
        this.API_BASE = 'http://localhost:8080/api/auth';
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authCallbacks = [];
        this.sessionChecked = false;
        
        // Escuchar eventos de página para mantener sesión
        this.setupPageListeners();
        
        // Iniciar heartbeat para mantener sesión activa
        this.startSessionHeartbeat();
    }
    
    startSessionHeartbeat() {
        // Heartbeat temporalmente deshabilitado (modo mock)
        console.log('💓 Heartbeat temporalmente deshabilitado (modo mock)');
        /*
        // Verificar sesión cada 5 minutos
        setInterval(() => {
            if (this.isAuthenticated) {
                console.log('💓 Heartbeat: verificando sesión...');
                this.checkSessionSilently();
            }
        }, 5 * 60 * 1000); // 5 minutos
        */
    }
    
    setupPageListeners() {
        // Interceptar recargas y mantener sesión
        window.addEventListener('beforeunload', () => {
            if (this.isAuthenticated && this.currentUser) {
                // Forzar guardado en localStorage antes de recargar
                localStorage.setItem('user_backup', JSON.stringify({
                    user: this.currentUser,
                    timestamp: Date.now(),
                    authenticated: true
                }));
            }
        });
        
        // DESHABILITADO temporalmente: Interceptar cuando la página se vuelve visible
        // document.addEventListener('visibilitychange', () => {
        //     if (!document.hidden && this.isAuthenticated) {
        //         // Verificar sesión cuando la página vuelve a ser visible
        //         this.checkSessionSilently();
        //     }
        // });
    }
    
    async login(username, password) {
        try {
            // MODO MOCK para desarrollo sin backend
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🔧 Usando login mock para desarrollo...');
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Login mock - acepta cualquier usuario/contraseña para desarrollo
                if (username && password) {
                    this.currentUser = {
                        username: username,
                        fullName: `Usuario ${username}`,
                        email: `${username}@utp.edu.pe`,
                        role: 'ADMIN',
                        sessionId: 'mock-session-' + Date.now()
                    };
                    this.isAuthenticated = true;
                    
                    // Guardar en localStorage para persistencia
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                    
                    // También crear backup para recargas
                    localStorage.setItem('user_backup', JSON.stringify({
                        user: this.currentUser,
                        timestamp: Date.now(),
                        authenticated: true
                    }));
                    
                    this.notifyAuthChange();
                    return { success: true, user: this.currentUser };
                } else {
                    return { success: false, message: 'Usuario y contraseña son requeridos' };
                }
            }
            
            // LOGIN REAL para producción
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
                
                // También crear backup para recargas
                localStorage.setItem('user_backup', JSON.stringify({
                    user: this.currentUser,
                    timestamp: Date.now(),
                    authenticated: true
                }));
                
                this.notifyAuthChange();
                return { success: true, user: this.currentUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            // Si hay error de conexión en desarrollo, usar login mock como fallback
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🔧 Fallback a login mock por error de conexión...');
                if (username && password) {
                    this.currentUser = {
                        username: username,
                        fullName: `Usuario ${username}`,
                        email: `${username}@utp.edu.pe`,
                        role: 'ADMIN',
                        sessionId: 'mock-session-' + Date.now()
                    };
                    this.isAuthenticated = true;
                    
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                    localStorage.setItem('user_backup', JSON.stringify({
                        user: this.currentUser,
                        timestamp: Date.now(),
                        authenticated: true
                    }));
                    
                    this.notifyAuthChange();
                    return { success: true, user: this.currentUser };
                }
            }
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
            localStorage.removeItem('user_backup'); // Limpiar también el backup
            
            this.notifyAuthChange();
            
            // Siempre retornar éxito si se limpió el estado local
            return true;
        } catch (error) {
            console.error('Error en logout:', error);
            // Limpiar estado local incluso si hay error de conexión
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('user_backup');
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
                this.currentUser = {
                    username: data.username,
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role
                };
                this.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                
                // Crear backup para recargas
                localStorage.setItem('user_backup', JSON.stringify({
                    user: this.currentUser,
                    timestamp: Date.now(),
                    authenticated: true
                }));
                
                this.notifyAuthChange();
                console.log('🔄 Estado actualizado con datos del servidor');
            } else {
                console.log('❌ Servidor dice que no hay sesión válida');
                this.clearSession();
            }
            
            return this.isAuthenticated;
        } catch (error) {
            console.error('❌ Error verificando sesión:', error);
            // En caso de error, mantener estado local si existe
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
                    // Actualizar datos si es necesario
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
                    }
                } else {
                    console.log('❌ Servidor confirma que no hay sesión válida');
                    // Solo limpiar si estamos seguros de que el servidor dice que no hay sesión
                    this.clearSession();
                }
            } else {
                console.log('⚠️ Error en verificación silenciosa, manteniendo estado actual');
            }
        } catch (error) {
            console.log('⚠️ Error de red en verificación silenciosa, manteniendo estado actual');
        }
    }
    
    clearSession() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('user_backup');
        this.notifyAuthChange();
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
        
        // Primero intentar cargar desde el backup de recarga
        const backup = localStorage.getItem('user_backup');
        if (backup) {
            try {
                const backupData = JSON.parse(backup);
                const timeDiff = Date.now() - backupData.timestamp;
                
                // Si el backup es reciente (menos de 5 minutos)
                if (timeDiff < 5 * 60 * 1000 && backupData.authenticated) {
                    console.log('🔄 Restaurando desde backup de recarga...');
                    this.currentUser = backupData.user;
                    this.isAuthenticated = true;
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                    localStorage.removeItem('user_backup');
                    this.notifyAuthChange();
                    
                    // Verificar en segundo plano pero no limpiar automáticamente
                    setTimeout(() => this.checkSessionSilently(), 1000);
                    return;
                }
            } catch (error) {
                console.error('Error al restaurar backup:', error);
            }
            localStorage.removeItem('user_backup');
        }
        
        // Luego intentar cargar desde el localStorage normal
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
                this.checkSession();
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
    
    // Inicializar inmediatamente
    userAuthService.initFromStorage();
    
    // Dar tiempo para verificaciones pero ser más conservador
    setTimeout(() => {
        console.log('⏰ Verificando estado final de autenticación...');
        console.log('Estado actual:', userAuthService.isAuthenticated ? 'Autenticado' : 'No autenticado');
        
        // Solo mostrar modal si definitivamente no hay sesión
        if (!userAuthService.isAuthenticated && !window.hasSessionData) {
            console.log('🔐 Mostrando modal de login (no hay datos de sesión)...');
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
            console.log('✅ Usuario ya autenticado o en proceso de verificación');
        }
    }, 1500); // Reducir tiempo pero dar margen suficiente
});
