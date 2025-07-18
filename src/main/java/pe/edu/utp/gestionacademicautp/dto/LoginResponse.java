package pe.edu.utp.gestionacademicautp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private String sessionId;
    private String username;
    private String fullName;
    private String role;
    
    // Constructor para login exitoso
    public LoginResponse(boolean success, String message, String sessionId, String username, String fullName, String role) {
        this.success = success;
        this.message = message;
        this.sessionId = sessionId;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
    }
    
    // Constructor para respuesta de error
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.sessionId = null;
        this.username = null;
        this.fullName = null;
        this.role = null;
    }
}
