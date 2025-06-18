package pe.edu.utp.gestionacademicautp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.gestionacademicautp.dto.CursoDTO;
import pe.edu.utp.gestionacademicautp.dto.EstudianteDTO;
import pe.edu.utp.gestionacademicautp.dto.ProyectoInvestigacionDTO;
import pe.edu.utp.gestionacademicautp.dto.ReporteIntegralEstudianteDTO;
import pe.edu.utp.gestionacademicautp.model.postgres.Estudiante;
import pe.edu.utp.gestionacademicautp.repository.postgres.EstudianteRepository;
import pe.edu.utp.gestionacademicautp.repository.mongo.ProyectoInvestigacionRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteIntegralEstudianteService {
    private final EstudianteRepository estudianteRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    @Qualifier("postgresJdbcTemplate")
    private final JdbcTemplate postgresJdbcTemplate;
    @Qualifier("mysqlJdbcTemplate")
    private final JdbcTemplate mysqlJdbcTemplate;
    private final ProyectoInvestigacionRepository proyectoRepository;

    @Transactional(transactionManager = "postgresTransactionManager", readOnly = true)
    public ReporteIntegralEstudianteDTO obtenerReporte(Integer estudianteId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId).orElse(null);
        if (estudiante == null) {
            return null;
        }

        // Mapper for Estudiante
        EstudianteDTO estudianteDTO = new EstudianteDTO();
        estudianteDTO.setId(estudiante.getId());
        estudianteDTO.setNombre(estudiante.getNombre());
        estudianteDTO.setApellido(estudiante.getApellido());
        estudianteDTO.setCorreo(estudiante.getCorreo());
        estudianteDTO.setFecha_nacimiento(estudiante.getFecha_nacimiento());

        // Get courses associated with the student from the database
        List<CursoDTO> cursoDTOs = getCursosForEstudiante(estudianteId);
        
        // Get projects associated with the student from the database
        List<ProyectoInvestigacionDTO> proyectoDTOs = getProyectosForEstudiante(estudianteId);

        ReporteIntegralEstudianteDTO reporte = new ReporteIntegralEstudianteDTO();
        reporte.setEstudiante(estudianteDTO);
        reporte.setCursos(cursoDTOs);
        reporte.setProyectos(proyectoDTOs);

        return reporte;
    }

    private List<CursoDTO> getCursosForEstudiante(Integer estudianteId) {
        try {
            // First, get the course IDs from PostgreSQL relationships table
            String sqlRelaciones = "SELECT curso_id FROM estudiante_curso WHERE estudiante_id = ?";
            List<Integer> cursoIds = postgresJdbcTemplate.queryForList(sqlRelaciones, Integer.class, estudianteId);
            
            if (cursoIds.isEmpty()) {
                return new ArrayList<>();
            }
            
            // Then, get the course details from MySQL
            String placeholders = String.join(",", cursoIds.stream().map(id -> "?").toArray(String[]::new));
            String sqlCursos = "SELECT id, nombre, codigo, creditos FROM cursos WHERE id IN (" + placeholders + ")";
            
            return mysqlJdbcTemplate.query(sqlCursos, (rs, rowNum) -> {
                CursoDTO curso = new CursoDTO();
                curso.setId(rs.getInt("id"));
                curso.setNombre(rs.getString("nombre"));
                curso.setCodigo(rs.getString("codigo"));
                curso.setCreditos(rs.getInt("creditos"));
                return curso;
            }, cursoIds.toArray());
        } catch (Exception e) {
            System.err.println("Error getting courses for student " + estudianteId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<ProyectoInvestigacionDTO> getProyectosForEstudiante(Integer estudianteId) {
        String sql = """
            SELECT ep.proyecto_id
            FROM estudiante_proyecto ep
            WHERE ep.estudiante_id = ?
            """;
        
        try {
            List<String> proyectoIds = postgresJdbcTemplate.queryForList(sql, String.class, estudianteId);
            List<ProyectoInvestigacionDTO> proyectos = new ArrayList<>();
            
            // For each project ID, fetch the project details from MongoDB
            for (String proyectoId : proyectoIds) {
                try {
                    proyectoRepository.findById(proyectoId).ifPresent(proyecto -> {
                        ProyectoInvestigacionDTO dto = new ProyectoInvestigacionDTO();
                        dto.setId(proyecto.getId());
                        dto.setTitulo(proyecto.getTitulo());
                        dto.setResumen(proyecto.getResumen());
                        dto.setFechaInicio(proyecto.getFechaInicio());
                        dto.setFechaFin(proyecto.getFechaFin());
                        proyectos.add(dto);
                    });
                } catch (Exception e) {
                    System.err.println("Error fetching project " + proyectoId + ": " + e.getMessage());
                }
            }
            
            return proyectos;
        } catch (Exception e) {
            System.err.println("Error getting projects for student " + estudianteId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void invalidarCacheReporte(Integer estudianteId) {
        String cacheKey = "reporte_estudiante:" + estudianteId;
        redisTemplate.delete(cacheKey);
    }
}
