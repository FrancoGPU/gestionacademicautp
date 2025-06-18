package pe.edu.utp.gestionacademicautp.model.mongo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "proyectos_investigacion")
@Data
public class ProyectoInvestigacion {
    @Id
    private String id;
    private String titulo;
    private String resumen;
    private String fechaInicio;
    private String fechaFin;
}
