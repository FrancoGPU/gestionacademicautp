package pe.edu.utp.gestionacademicautp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.gestionacademicautp.dto.CursoDTO;
import pe.edu.utp.gestionacademicautp.model.mysql.Curso;
import pe.edu.utp.gestionacademicautp.repository.mysql.CursoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;

    @Transactional(readOnly = true, transactionManager = "mysqlTransactionManager")
    public List<CursoDTO> getAllCursos() {
        return cursoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true, transactionManager = "mysqlTransactionManager")
    public CursoDTO getCursoById(Integer id) {
        return cursoRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }

    @Transactional(transactionManager = "mysqlTransactionManager")
    public CursoDTO createCurso(CursoDTO cursoDTO) {
        Curso curso = convertToEntity(cursoDTO);
        curso = cursoRepository.save(curso);
        return convertToDto(curso);
    }

    @Transactional(transactionManager = "mysqlTransactionManager")
    public CursoDTO updateCurso(Integer id, CursoDTO cursoDTO) {
        return cursoRepository.findById(id).map(curso -> {
            curso.setNombre(cursoDTO.getNombre());
            curso.setCodigo(cursoDTO.getCodigo());
            curso.setCreditos(cursoDTO.getCreditos());
            return convertToDto(cursoRepository.save(curso));
        }).orElse(null);
    }

    @Transactional(transactionManager = "mysqlTransactionManager")
    public void deleteCurso(Integer id) {
        cursoRepository.deleteById(id);
    }

    private CursoDTO convertToDto(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setId(curso.getId());
        dto.setNombre(curso.getNombre());
        dto.setCodigo(curso.getCodigo());
        dto.setCreditos(curso.getCreditos());
        return dto;
    }

    private Curso convertToEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setNombre(dto.getNombre());
        curso.setCodigo(dto.getCodigo());
        curso.setCreditos(dto.getCreditos());
        return curso;
    }
}
