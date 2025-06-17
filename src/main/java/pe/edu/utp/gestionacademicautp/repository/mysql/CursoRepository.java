package pe.edu.utp.gestionacademicautp.repository.mysql;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.gestionacademicautp.model.mysql.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}
