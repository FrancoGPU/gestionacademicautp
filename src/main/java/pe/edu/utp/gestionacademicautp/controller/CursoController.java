package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.dto.CursoDTO;
import pe.edu.utp.gestionacademicautp.service.CursoService;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @GetMapping
    public List<CursoDTO> getAll() {
        return cursoService.getAllCursos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> getById(@PathVariable Integer id) {
        CursoDTO cursoDTO = cursoService.getCursoById(id);
        if (cursoDTO != null) {
            return ResponseEntity.ok(cursoDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public CursoDTO create(@RequestBody CursoDTO cursoDTO) {
        return cursoService.createCurso(cursoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> update(@PathVariable Integer id, @RequestBody CursoDTO cursoDTO) {
        CursoDTO updatedCurso = cursoService.updateCurso(id, cursoDTO);
        if (updatedCurso != null) {
            return ResponseEntity.ok(updatedCurso);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        cursoService.deleteCurso(id);
        return ResponseEntity.noContent().build();
    }
}
