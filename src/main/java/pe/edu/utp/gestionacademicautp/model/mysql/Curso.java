package pe.edu.utp.gestionacademicautp.model.mysql;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cursos") // Especifica el nombre correcto de la tabla
@Data
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String codigo;
    private int creditos;
}
