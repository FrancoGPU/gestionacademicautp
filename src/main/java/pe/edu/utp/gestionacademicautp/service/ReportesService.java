package pe.edu.utp.gestionacademicautp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.gestionacademicautp.dto.DashboardStatsDTO;
import pe.edu.utp.gestionacademicautp.repository.cassandra.ProfesorRepository;
import pe.edu.utp.gestionacademicautp.repository.mongo.ProyectoInvestigacionRepository;
import pe.edu.utp.gestionacademicautp.repository.mysql.CursoRepository;
import pe.edu.utp.gestionacademicautp.repository.postgres.EstudianteRepository;

@Service
@RequiredArgsConstructor
public class ReportesService {

    private final EstudianteRepository estudianteRepository;
    private final ProfesorRepository profesorRepository;
    private final CursoRepository cursoRepository;
    private final ProyectoInvestigacionRepository proyectoRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalEstudiantes = 0L;
        long totalProfesores = 0L;
        long totalCursos = 0L;
        long totalProyectos = 0L;

        // Obtener conteo de estudiantes (PostgreSQL)
        try {
            totalEstudiantes = estudianteRepository.count();
        } catch (Exception e) {
            System.err.println("Error al obtener conteo de estudiantes: " + e.getMessage());
            totalEstudiantes = 0L;
        }

        // Obtener conteo de profesores (Cassandra)
        try {
            totalProfesores = profesorRepository.count();
        } catch (Exception e) {
            System.err.println("Error al obtener conteo de profesores: " + e.getMessage());
            totalProfesores = 0L;
        }

        // Obtener conteo de cursos (MySQL)
        try {
            totalCursos = cursoRepository.count();
        } catch (Exception e) {
            System.err.println("Error al obtener conteo de cursos: " + e.getMessage());
            totalCursos = 0L;
        }

        // Obtener conteo de proyectos (MongoDB)
        try {
            totalProyectos = proyectoRepository.count();
        } catch (Exception e) {
            System.err.println("Error al obtener conteo de proyectos: " + e.getMessage());
            totalProyectos = 0L;
        }

        return new DashboardStatsDTO(
            totalEstudiantes,
            totalProfesores,
            totalCursos,
            totalProyectos
        );
    }
}
