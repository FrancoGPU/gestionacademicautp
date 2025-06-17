package pe.edu.utp.gestionacademicautp.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import pe.edu.utp.gestionacademicautp.model.mongo.ProyectoInvestigacion;

public interface ProyectoInvestigacionRepository extends MongoRepository<ProyectoInvestigacion, String> {
}
