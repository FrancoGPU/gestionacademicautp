package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.model.mongo.ProyectoInvestigacion;
import pe.edu.utp.gestionacademicautp.repository.mongo.ProyectoInvestigacionRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
public class ProyectoInvestigacionController {
    private final ProyectoInvestigacionRepository proyectoInvestigacionRepository;

    @GetMapping
    public List<ProyectoInvestigacion> getAll() {
        return proyectoInvestigacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoInvestigacion> getById(@PathVariable String id) {
        Optional<ProyectoInvestigacion> proyecto = proyectoInvestigacionRepository.findById(id);
        return proyecto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProyectoInvestigacion create(@RequestBody ProyectoInvestigacion proyecto) {
        return proyectoInvestigacionRepository.save(proyecto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoInvestigacion> update(@PathVariable String id, @RequestBody ProyectoInvestigacion proyectoDetails) {
        Optional<ProyectoInvestigacion> optionalProyecto = proyectoInvestigacionRepository.findById(id);
        if (optionalProyecto.isPresent()) {
            ProyectoInvestigacion proyecto = optionalProyecto.get();
            proyecto.setTitulo(proyectoDetails.getTitulo());
            proyecto.setDescripcion(proyectoDetails.getDescripcion());
            proyecto.setResponsable(proyectoDetails.getResponsable());
            proyecto.setAnio(proyectoDetails.getAnio());
            return ResponseEntity.ok(proyectoInvestigacionRepository.save(proyecto));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        Optional<ProyectoInvestigacion> optionalProyecto = proyectoInvestigacionRepository.findById(id);
        if (optionalProyecto.isPresent()) {
            proyectoInvestigacionRepository.delete(optionalProyecto.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
