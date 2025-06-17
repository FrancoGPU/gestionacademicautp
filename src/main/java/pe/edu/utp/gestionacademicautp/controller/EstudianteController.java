package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.model.postgres.Estudiante;
import pe.edu.utp.gestionacademicautp.repository.postgres.EstudianteRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {
    private final EstudianteRepository estudianteRepository;

    @GetMapping
    public List<Estudiante> getAll() {
        return estudianteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getById(@PathVariable Long id) {
        Optional<Estudiante> estudiante = estudianteRepository.findById(id);
        return estudiante.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estudiante create(@RequestBody Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> update(@PathVariable Long id, @RequestBody Estudiante estudianteDetails) {
        Optional<Estudiante> optionalEstudiante = estudianteRepository.findById(id);
        if (optionalEstudiante.isPresent()) {
            Estudiante estudiante = optionalEstudiante.get();
            estudiante.setNombre(estudianteDetails.getNombre());
            estudiante.setApellido(estudianteDetails.getApellido());
            estudiante.setCorreo(estudianteDetails.getCorreo());
            estudiante.setFecha_nacimiento(estudianteDetails.getFecha_nacimiento());
            return ResponseEntity.ok(estudianteRepository.save(estudiante));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Estudiante> optionalEstudiante = estudianteRepository.findById(id);
        if (optionalEstudiante.isPresent()) {
            estudianteRepository.delete(optionalEstudiante.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
