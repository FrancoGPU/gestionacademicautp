package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.dto.EstudianteDTO;
import pe.edu.utp.gestionacademicautp.service.EstudianteService;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;

    @GetMapping
    public List<EstudianteDTO> getAll() {
        return estudianteService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteDTO> getById(@PathVariable Integer id) {
        EstudianteDTO estudianteDTO = estudianteService.getById(id);
        if (estudianteDTO != null) {
            return ResponseEntity.ok(estudianteDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public EstudianteDTO create(@RequestBody EstudianteDTO estudianteDTO) {
        return estudianteService.create(estudianteDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteDTO> update(@PathVariable Integer id, @RequestBody EstudianteDTO estudianteDTO) {
        EstudianteDTO updatedEstudiante = estudianteService.update(id, estudianteDTO);
        if (updatedEstudiante != null) {
            return ResponseEntity.ok(updatedEstudiante);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        estudianteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
