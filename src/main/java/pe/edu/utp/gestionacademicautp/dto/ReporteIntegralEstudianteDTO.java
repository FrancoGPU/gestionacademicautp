package pe.edu.utp.gestionacademicautp.dto;

import java.util.List;

public class ReporteIntegralEstudianteDTO {
    private EstudianteDTO estudiante;
    private List<CursoDTO> cursos;
    private List<ProyectoInvestigacionDTO> proyectos;

    // Getters and Setters
    public EstudianteDTO getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(EstudianteDTO estudiante) {
        this.estudiante = estudiante;
    }

    public List<CursoDTO> getCursos() {
        return cursos;
    }

    public void setCursos(List<CursoDTO> cursos) {
        this.cursos = cursos;
    }

    public List<ProyectoInvestigacionDTO> getProyectos() {
        return proyectos;
    }

    public void setProyectos(List<ProyectoInvestigacionDTO> proyectos) {
        this.proyectos = proyectos;
    }
}
