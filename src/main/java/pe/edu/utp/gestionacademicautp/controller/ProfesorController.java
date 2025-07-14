package pe.edu.utp.gestionacademicautp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.model.cassandra.Profesor;
import pe.edu.utp.gestionacademicautp.service.ProfesorService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profesores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;

    // GET /api/profesores - Obtener todos los profesores
    @GetMapping
    public ResponseEntity<List<Profesor>> getAllProfesores() {
        try {
            List<Profesor> profesores = profesorService.getAllProfesores();
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/{id} - Obtener profesor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Profesor> getProfesorById(@PathVariable UUID id) {
        try {
            Optional<Profesor> profesor = profesorService.getProfesorById(id);
            return profesor.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/profesores - Crear nuevo profesor
    @PostMapping
    public ResponseEntity<Profesor> createProfesor(@RequestBody Profesor profesor) {
        try {
            Profesor nuevoProfesor = profesorService.createProfesor(profesor);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProfesor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // PUT /api/profesores/{id} - Actualizar profesor
    @PutMapping("/{id}")
    public ResponseEntity<Profesor> updateProfesor(@PathVariable UUID id, @RequestBody Profesor profesorDetails) {
        try {
            Profesor profesorActualizado = profesorService.updateProfesor(id, profesorDetails);
            return ResponseEntity.ok(profesorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE /api/profesores/{id} - Eliminar profesor (marcar como inactivo)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesor(@PathVariable UUID id) {
        try {
            profesorService.deleteProfesor(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/activos - Obtener profesores activos
    @GetMapping("/activos")
    public ResponseEntity<List<Profesor>> getProfesoresActivos() {
        try {
            List<Profesor> profesores = profesorService.getProfesoresActivos();
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/especialidad/{especialidad} - Obtener profesores por especialidad
    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<List<Profesor>> getProfesoresByEspecialidad(@PathVariable String especialidad) {
        try {
            List<Profesor> profesores = profesorService.getProfesoresByEspecialidad(especialidad);
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/grado/{grado} - Obtener profesores por grado académico
    @GetMapping("/grado/{grado}")
    public ResponseEntity<List<Profesor>> getProfesoresByGrado(@PathVariable String grado) {
        try {
            List<Profesor> profesores = profesorService.getProfesoresByGradoAcademico(grado);
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/experiencia/{anos} - Obtener profesores con experiencia mínima
    @GetMapping("/experiencia/{anos}")
    public ResponseEntity<List<Profesor>> getProfesoresConExperiencia(@PathVariable Integer anos) {
        try {
            List<Profesor> profesores = profesorService.getProfesoresConExperiencia(anos);
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/profesores/correo/{correo} - Buscar profesor por correo
    @GetMapping("/correo/{correo}")
    public ResponseEntity<List<Profesor>> getProfesorByCorreo(@PathVariable String correo) {
        try {
            List<Profesor> profesores = profesorService.getProfesorByCorreo(correo);
            return ResponseEntity.ok(profesores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
