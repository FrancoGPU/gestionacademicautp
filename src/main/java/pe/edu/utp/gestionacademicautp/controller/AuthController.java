package pe.edu.utp.gestionacademicautp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.dto.LoginRequest;
import pe.edu.utp.gestionacademicautp.dto.LoginResponse;
import pe.edu.utp.gestionacademicautp.model.User;
import pe.edu.utp.gestionacademicautp.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            String sessionId = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
            
            if (sessionId != null) {
                // Crear cookie de sesión
                Cookie sessionCookie = new Cookie("SESSION_ID", sessionId);
                sessionCookie.setMaxAge(24 * 60 * 60); // 24 horas
                sessionCookie.setPath("/");
                sessionCookie.setHttpOnly(true);
                response.addCookie(sessionCookie);
                
                User user = authService.getUserByUsername(loginRequest.getUsername());
                
                return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Login exitoso",
                    sessionId,
                    user.getUsername(),
                    user.getFullName(),
                    user.getRole()
                ));
            } else {
                return ResponseEntity.badRequest().body(new LoginResponse(
                    false,
                    "Credenciales inválidas",
                    null,
                    null,
                    null,
                    null
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new LoginResponse(
                false,
                "Error interno del servidor",
                null,
                null,
                null,
                null
            ));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String sessionId = getSessionIdFromRequest(request);
            
            if (sessionId != null) {
                boolean loggedOut = authService.logout(sessionId);
                
                // Limpiar cookie
                Cookie sessionCookie = new Cookie("SESSION_ID", "");
                sessionCookie.setMaxAge(0);
                sessionCookie.setPath("/");
                response.addCookie(sessionCookie);
                
                result.put("success", true);
                result.put("message", "Logout exitoso");
            } else {
                result.put("success", false);
                result.put("message", "No hay sesión activa");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error durante el logout");
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String sessionId = getSessionIdFromRequest(request);
            User user = authService.validateSession(sessionId);
            
            if (user != null) {
                result.put("authenticated", true);
                result.put("username", user.getUsername());
                result.put("fullName", user.getFullName());
                result.put("email", user.getEmail());
                result.put("role", user.getRole());
            } else {
                result.put("authenticated", false);
                result.put("message", "Sesión no válida o expirada");
            }
        } catch (Exception e) {
            result.put("authenticated", false);
            result.put("message", "Error al validar sesión");
        }
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/renew")
    public ResponseEntity<Map<String, Object>> renewSession(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String sessionId = getSessionIdFromRequest(request);
            boolean renewed = authService.renewSession(sessionId);
            
            result.put("success", renewed);
            result.put("message", renewed ? "Sesión renovada" : "No se pudo renovar la sesión");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error al renovar sesión");
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String sessionId = getSessionIdFromRequest(request);
            User currentUser = authService.validateSession(sessionId);
            
            if (currentUser == null) {
                result.put("success", false);
                result.put("message", "Sesión no válida");
                return ResponseEntity.status(401).body(result);
            }
            
            if (!"ADMIN".equals(currentUser.getRole())) {
                result.put("success", false);
                result.put("message", "Acceso denegado - Se requieren permisos de administrador");
                return ResponseEntity.status(403).body(result);
            }
            
            Map<String, User> users = authService.getAllUsers();
            Map<String, Map<String, Object>> userSummary = new HashMap<>();
            
            for (Map.Entry<String, User> entry : users.entrySet()) {
                User user = entry.getValue();
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("username", user.getUsername());
                userInfo.put("fullName", user.getFullName());
                userInfo.put("email", user.getEmail());
                userInfo.put("role", user.getRole());
                userInfo.put("active", user.isActive());
                userInfo.put("createdAt", user.getCreatedAt());
                userInfo.put("lastLogin", user.getLastLogin());
                
                userSummary.put(entry.getKey(), userInfo);
            }
            
            result.put("success", true);
            result.put("users", userSummary);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error al obtener usuarios");
        }
        
        return ResponseEntity.ok(result);
    }
    
    private String getSessionIdFromRequest(HttpServletRequest request) {
        // Primero intenta obtener de las cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("SESSION_ID".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        // Si no está en cookies, intenta obtener del header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        // Como último recurso, intenta obtener como parámetro
        return request.getParameter("sessionId");
    }
}
