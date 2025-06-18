package pe.edu.utp.gestionacademicautp.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pe.edu.utp.gestionacademicautp.model.mongo.ProyectoInvestigacion;

@Repository
public interface ProyectoInvestigacionRepository extends MongoRepository<ProyectoInvestigacion, String> {
}
