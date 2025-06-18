package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.dto.ProyectoInvestigacionDTO;
import pe.edu.utp.gestionacademicautp.service.ProyectoInvestigacionService;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
public class ProyectoInvestigacionController {

    private final ProyectoInvestigacionService proyectoInvestigacionService;

    @GetMapping
    public List<ProyectoInvestigacionDTO> getAll() {
        return proyectoInvestigacionService.getAllProyectos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoInvestigacionDTO> getById(@PathVariable String id) {
        ProyectoInvestigacionDTO proyectoDTO = proyectoInvestigacionService.getProyectoById(id);
        if (proyectoDTO != null) {
            return ResponseEntity.ok(proyectoDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ProyectoInvestigacionDTO create(@RequestBody ProyectoInvestigacionDTO proyectoDTO) {
        return proyectoInvestigacionService.createProyecto(proyectoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoInvestigacionDTO> update(@PathVariable String id, @RequestBody ProyectoInvestigacionDTO proyectoDTO) {
        ProyectoInvestigacionDTO updatedProyecto = proyectoInvestigacionService.updateProyecto(id, proyectoDTO);
        if (updatedProyecto != null) {
            return ResponseEntity.ok(updatedProyecto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        proyectoInvestigacionService.deleteProyecto(id);
        return ResponseEntity.noContent().build();
    }
}
