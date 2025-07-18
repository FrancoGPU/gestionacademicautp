package pe.edu.utp.gestionacademicautp.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String password; 
    private String email;
    private String firstName;
    private String lastName;
    private String role; // ADMIN, USER, PROFESSOR
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    
    // Constructor para crear usuario básico
    public User(String username, String password, String email, String firstName, String lastName, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
