package pe.edu.utp.gestionacademicautp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.gestionacademicautp.dto.EstudianteDTO;
import pe.edu.utp.gestionacademicautp.model.postgres.Estudiante;
import pe.edu.utp.gestionacademicautp.repository.postgres.EstudianteRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final ReporteIntegralEstudianteService reporteService;
    @Qualifier("postgresJdbcTemplate")
    private final JdbcTemplate postgresJdbcTemplate;

    @Transactional(readOnly = true, transactionManager = "postgresTransactionManager")
    public List<EstudianteDTO> getAll() {
        try {
            return estudianteRepository.findAll().stream().map(this::convertToDtoWithRelations).collect(Collectors.toList());
        } catch (Exception e) {
            // Log the error and return an empty list
            System.err.println("Error fetching students: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Transactional(readOnly = true, transactionManager = "postgresTransactionManager")
    public EstudianteDTO getById(Integer id) {
        return estudianteRepository.findById(id).map(this::convertToDtoWithRelations).orElse(null);
    }

    @Transactional(transactionManager = "postgresTransactionManager")
    public EstudianteDTO create(EstudianteDTO estudianteDTO) {
        Estudiante estudiante = convertToEntity(estudianteDTO);
        Estudiante savedEstudiante = estudianteRepository.save(estudiante);
        
        // Save course relationships
        if (estudianteDTO.getCursoIds() != null) {
            updateCursoRelationships(savedEstudiante.getId(), estudianteDTO.getCursoIds());
        }
        
        // Save project relationships
        if (estudianteDTO.getProyectoIds() != null) {
            updateProyectoRelationships(savedEstudiante.getId(), estudianteDTO.getProyectoIds());
        }
        
        return convertToDto(savedEstudiante);
    }

    @Transactional(transactionManager = "postgresTransactionManager")
    public EstudianteDTO update(Integer id, EstudianteDTO estudianteDTO) {
        return estudianteRepository.findById(id).map(estudiante -> {
            estudiante.setNombre(estudianteDTO.getNombre());
            estudiante.setApellido(estudianteDTO.getApellido());
            estudiante.setCorreo(estudianteDTO.getCorreo());
            estudiante.setFecha_nacimiento(estudianteDTO.getFecha_nacimiento());
            Estudiante updatedEstudiante = estudianteRepository.save(estudiante);
            
            // Update course relationships
            if (estudianteDTO.getCursoIds() != null) {
                updateCursoRelationships(id, estudianteDTO.getCursoIds());
            }
            
            // Update project relationships
            if (estudianteDTO.getProyectoIds() != null) {
                updateProyectoRelationships(id, estudianteDTO.getProyectoIds());
            }
            
            reporteService.invalidarCacheReporte(id);
            return convertToDto(updatedEstudiante);
        }).orElse(null);
    }

    @Transactional(transactionManager = "postgresTransactionManager")
    public void delete(Integer id) {
        // Delete relationships first
        postgresJdbcTemplate.update("DELETE FROM estudiante_curso WHERE estudiante_id = ?", id);
        postgresJdbcTemplate.update("DELETE FROM estudiante_proyecto WHERE estudiante_id = ?", id);
        // Then delete the student
        estudianteRepository.deleteById(id);
        reporteService.invalidarCacheReporte(id);
    }

    private EstudianteDTO convertToDto(Estudiante estudiante) {
        EstudianteDTO dto = new EstudianteDTO();
        dto.setId(estudiante.getId());
        dto.setNombre(estudiante.getNombre());
        dto.setApellido(estudiante.getApellido());
        dto.setCorreo(estudiante.getCorreo());
        dto.setFecha_nacimiento(estudiante.getFecha_nacimiento());
        return dto;
    }

    private EstudianteDTO convertToDtoWithRelations(Estudiante estudiante) {
        EstudianteDTO dto = convertToDto(estudiante);
        
        // Get related course IDs
        List<Integer> cursoIds = postgresJdbcTemplate.queryForList(
            "SELECT curso_id FROM estudiante_curso WHERE estudiante_id = ?", 
            Integer.class, 
            estudiante.getId()
        );
        dto.setCursoIds(cursoIds.isEmpty() ? null : cursoIds);
        
        // Get related project IDs
        List<String> proyectoIds = postgresJdbcTemplate.queryForList(
            "SELECT proyecto_id FROM estudiante_proyecto WHERE estudiante_id = ?", 
            String.class, 
            estudiante.getId()
        );
        dto.setProyectoIds(proyectoIds.isEmpty() ? null : proyectoIds);
        
        return dto;
    }

    private Estudiante convertToEntity(EstudianteDTO dto) {
        Estudiante estudiante = new Estudiante();
        estudiante.setNombre(dto.getNombre());
        estudiante.setApellido(dto.getApellido());
        estudiante.setCorreo(dto.getCorreo());
        estudiante.setFecha_nacimiento(dto.getFecha_nacimiento());
        return estudiante;
    }

    private void updateCursoRelationships(Integer estudianteId, List<Integer> cursoIds) {
        // Delete existing relationships
        postgresJdbcTemplate.update("DELETE FROM estudiante_curso WHERE estudiante_id = ?", estudianteId);
        
        // Insert new relationships
        for (Integer cursoId : cursoIds) {
            postgresJdbcTemplate.update(
                "INSERT INTO estudiante_curso (estudiante_id, curso_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
                estudianteId, cursoId
            );
        }
    }

    private void updateProyectoRelationships(Integer estudianteId, List<String> proyectoIds) {
        // Delete existing relationships
        postgresJdbcTemplate.update("DELETE FROM estudiante_proyecto WHERE estudiante_id = ?", estudianteId);
        
        // Insert new relationships
        for (String proyectoId : proyectoIds) {
            postgresJdbcTemplate.update(
                "INSERT INTO estudiante_proyecto (estudiante_id, proyecto_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
                estudianteId, proyectoId
            );
        }
    }
}
