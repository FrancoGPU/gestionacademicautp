package pe.edu.utp.gestionacademicautp.repository.cassandra;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.utp.gestionacademicautp.model.cassandra.Profesor;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProfesorRepository extends CassandraRepository<Profesor, UUID> {
    
    // Buscar profesores por especialidad
    List<Profesor> findByEspecialidad(String especialidad);
    
    // Buscar profesores activos
    List<Profesor> findByActivoTrue();
    
    // Buscar profesores por correo
    List<Profesor> findByCorreo(String correo);
    
    // Buscar profesores por grado académico
    List<Profesor> findByGradoAcademico(String gradoAcademico);
    
    // Buscar profesores con más de X años de experiencia
    @Query("SELECT * FROM profesores WHERE anos_experiencia >= ?0 ALLOW FILTERING")
    List<Profesor> findByAnosExperienciaGreaterThanEqual(Integer anosExperiencia);
    
    // Buscar profesores por nombre (case insensitive)
    @Query("SELECT * FROM profesores WHERE nombre = ?0 ALLOW FILTERING")
    List<Profesor> findByNombreIgnoreCase(String nombre);
}
