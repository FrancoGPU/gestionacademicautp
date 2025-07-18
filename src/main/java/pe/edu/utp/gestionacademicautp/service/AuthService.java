package pe.edu.utp.gestionacademicautp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.utp.gestionacademicautp.model.User;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Simulamos una base de datos de usuarios (en producción esto estaría en una base de datos real)
    private final Map<String, User> users = new HashMap<>();
    
    public AuthService() {
        initializeDefaultUsers();
    }
    
    private void initializeDefaultUsers() {
        // Crear usuarios por defecto
        User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@utp.edu.pe", "Administrador", "Sistema", "ADMIN");
        User user = new User("usuario", passwordEncoder.encode("user123"), "usuario@utp.edu.pe", "Usuario", "Demo", "USER");
        User professor = new User("profesor", passwordEncoder.encode("prof123"), "profesor@utp.edu.pe", "Profesor", "Demo", "PROFESSOR");
        
        users.put("admin", admin);
        users.put("usuario", user);
        users.put("profesor", professor);
    }
    
    public String login(String username, String password) {
        User user = users.get(username);
        
        if (user == null || !user.isActive()) {
            return null; // Usuario no existe o está inactivo
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null; // Contraseña incorrecta
        }
        
        // Generar ID de sesión único
        String sessionId = UUID.randomUUID().toString();
        
        // Actualizar último login
        user.setLastLogin(LocalDateTime.now());
        
        // Guardar sesión en Redis (expira en 24 horas)
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("username", user.getUsername());
        sessionData.put("fullName", user.getFullName());
        sessionData.put("email", user.getEmail());
        sessionData.put("role", user.getRole());
        sessionData.put("loginTime", LocalDateTime.now().toString());
        
        redisTemplate.opsForHash().putAll("session:" + sessionId, sessionData);
        redisTemplate.expire("session:" + sessionId, 24, TimeUnit.HOURS);
        
        return sessionId;
    }
    
    public User validateSession(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return null;
        }
        
        Map<Object, Object> sessionData = redisTemplate.opsForHash().entries("session:" + sessionId);
        
        if (sessionData.isEmpty()) {
            return null; // Sesión no existe o expiró
        }
        
        String username = (String) sessionData.get("username");
        return users.get(username);
    }
    
    public boolean logout(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return false;
        }
        
        return Boolean.TRUE.equals(redisTemplate.delete("session:" + sessionId));
    }
    
    public User getUserByUsername(String username) {
        return users.get(username);
    }
    
    // Método para obtener todos los usuarios (para administración)
    public Map<String, User> getAllUsers() {
        return new HashMap<>(users);
    }
    
    // Renovar sesión (extender tiempo de expiración)
    public boolean renewSession(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return false;
        }
        
        if (Boolean.TRUE.equals(redisTemplate.hasKey("session:" + sessionId))) {
            redisTemplate.expire("session:" + sessionId, 24, TimeUnit.HOURS);
            return true;
        }
        
        return false;
    }
}
