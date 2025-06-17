package pe.edu.utp.gestionacademicautp.repository.postgres;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.gestionacademicautp.model.postgres.Estudiante;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
}
