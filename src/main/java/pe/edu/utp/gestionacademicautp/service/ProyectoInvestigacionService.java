package pe.edu.utp.gestionacademicautp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.gestionacademicautp.dto.ProyectoInvestigacionDTO;
import pe.edu.utp.gestionacademicautp.model.mongo.ProyectoInvestigacion;
import pe.edu.utp.gestionacademicautp.repository.mongo.ProyectoInvestigacionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoInvestigacionService {

    private final ProyectoInvestigacionRepository proyectoInvestigacionRepository;

    public List<ProyectoInvestigacionDTO> getAllProyectos() {
        return proyectoInvestigacionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProyectoInvestigacionDTO getProyectoById(String id) {
        return proyectoInvestigacionRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }

    public ProyectoInvestigacionDTO createProyecto(ProyectoInvestigacionDTO proyectoDTO) {
        ProyectoInvestigacion proyecto = convertToEntity(proyectoDTO);
        proyecto = proyectoInvestigacionRepository.save(proyecto);
        return convertToDto(proyecto);
    }

    public ProyectoInvestigacionDTO updateProyecto(String id, ProyectoInvestigacionDTO proyectoDTO) {
        return proyectoInvestigacionRepository.findById(id).map(proyecto -> {
            proyecto.setTitulo(proyectoDTO.getTitulo());
            proyecto.setResumen(proyectoDTO.getResumen());
            proyecto.setFechaInicio(proyectoDTO.getFechaInicio());
            proyecto.setFechaFin(proyectoDTO.getFechaFin());
            return convertToDto(proyectoInvestigacionRepository.save(proyecto));
        }).orElse(null);
    }

    public void deleteProyecto(String id) {
        proyectoInvestigacionRepository.deleteById(id);
    }

    private ProyectoInvestigacionDTO convertToDto(ProyectoInvestigacion proyecto) {
        ProyectoInvestigacionDTO dto = new ProyectoInvestigacionDTO();
        dto.setId(proyecto.getId());
        dto.setTitulo(proyecto.getTitulo());
        dto.setResumen(proyecto.getResumen());
        dto.setFechaInicio(proyecto.getFechaInicio());
        dto.setFechaFin(proyecto.getFechaFin());
        return dto;
    }

    private ProyectoInvestigacion convertToEntity(ProyectoInvestigacionDTO dto) {
        ProyectoInvestigacion proyecto = new ProyectoInvestigacion();
        proyecto.setTitulo(dto.getTitulo());
        proyecto.setResumen(dto.getResumen());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFin(dto.getFechaFin());
        return proyecto;
    }
}
