package pe.edu.utp.gestionacademicautp.model.mongo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "proyectos_investigacion")
public class ProyectoInvestigacion {
    @Id
    private String id;
    private String titulo;
    private String descripcion;
    private String responsable;
    private int anio;
}
