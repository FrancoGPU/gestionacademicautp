package pe.edu.utp.gestionacademicautp.model.cassandra;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.mapping.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Table("profesores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profesor {
    
    @PrimaryKey
    private UUID id;
    
    @Column("nombre")
    private String nombre;
    
    @Column("apellido")
    private String apellido;
    
    @Column("correo")
    private String correo;
    
    @Column("especialidad")
    private String especialidad;
    
    @Column("telefono")
    private String telefono;
    
    @Column("grado_academico")
    private String gradoAcademico;
    
    @Column("anos_experiencia")
    private Integer anosExperiencia;
    
    @Column("activo")
    private Boolean activo;
    
    // Cursos que enseña (IDs de MySQL)
    @Column("curso_ids")
    private Set<Integer> cursoIds;
    
    // Constructor para facilitar creación
    public Profesor(String nombre, String apellido, String correo, String especialidad, 
                   String telefono, String gradoAcademico, Integer anosExperiencia) {
        this.id = UUID.randomUUID();
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.especialidad = especialidad;
        this.telefono = telefono;
        this.gradoAcademico = gradoAcademico;
        this.anosExperiencia = anosExperiencia;
        this.activo = true;
    }
}
