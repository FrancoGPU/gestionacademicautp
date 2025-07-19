package pe.edu.utp.gestionacademicautp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.gestionacademicautp.model.cassandra.Profesor;
import pe.edu.utp.gestionacademicautp.repository.cassandra.ProfesorRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    // Obtener todos los profesores
    public List<Profesor> getAllProfesores() {
        return profesorRepository.findAll();
    }

    // Obtener profesor por ID
    public Optional<Profesor> getProfesorById(UUID id) {
        return profesorRepository.findById(id);
    }

    // Crear nuevo profesor
    public Profesor createProfesor(Profesor profesor) {
        if (profesor.getId() == null) {
            profesor.setId(UUID.randomUUID());
        }
        if (profesor.getActivo() == null) {
            profesor.setActivo(true);
        }
        return profesorRepository.save(profesor);
    }

    // Actualizar profesor
    public Profesor updateProfesor(UUID id, Profesor profesorDetails) {
        Optional<Profesor> profesorExistente = profesorRepository.findById(id);
        if (profesorExistente.isPresent()) {
            Profesor profesor = profesorExistente.get();
            profesor.setNombre(profesorDetails.getNombre());
            profesor.setApellido(profesorDetails.getApellido());
            profesor.setCorreo(profesorDetails.getCorreo());
            profesor.setEspecialidad(profesorDetails.getEspecialidad());
            profesor.setTelefono(profesorDetails.getTelefono());
            profesor.setGradoAcademico(profesorDetails.getGradoAcademico());
            profesor.setAnosExperiencia(profesorDetails.getAnosExperiencia());
            profesor.setActivo(profesorDetails.getActivo());
            profesor.setCursoIds(profesorDetails.getCursoIds());
            return profesorRepository.save(profesor);
        }
        throw new RuntimeException("Profesor no encontrado con ID: " + id);
    }

    // Eliminar profesor físicamente de la base de datos
    public void deleteProfesor(UUID id) {
        Optional<Profesor> profesor = profesorRepository.findById(id);
        if (profesor.isPresent()) {
            profesorRepository.deleteById(id);
        } else {
            throw new RuntimeException("Profesor no encontrado con ID: " + id);
        }
    }

    // Obtener profesores activos
    public List<Profesor> getProfesoresActivos() {
        return profesorRepository.findByActivoTrue();
    }

    // Obtener profesores por especialidad
    public List<Profesor> getProfesoresByEspecialidad(String especialidad) {
        return profesorRepository.findByEspecialidad(especialidad);
    }

    // Obtener profesores por grado académico
    public List<Profesor> getProfesoresByGradoAcademico(String gradoAcademico) {
        return profesorRepository.findByGradoAcademico(gradoAcademico);
    }

    // Obtener profesores con experiencia mínima
    public List<Profesor> getProfesoresConExperiencia(Integer anosMinimos) {
        return profesorRepository.findByAnosExperienciaGreaterThanEqual(anosMinimos);
    }

    // Buscar profesor por correo
    public List<Profesor> getProfesorByCorreo(String correo) {
        return profesorRepository.findByCorreo(correo);
    }
}
