package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.utp.gestionacademicautp.dto.ReporteIntegralEstudianteDTO;
import pe.edu.utp.gestionacademicautp.service.ReporteIntegralEstudianteService;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteIntegralEstudianteController {
    private final ReporteIntegralEstudianteService reporteService;

    @GetMapping("/estudiante/{id}")
    public ResponseEntity<ReporteIntegralEstudianteDTO> obtenerReporte(@PathVariable Integer id) {
        ReporteIntegralEstudianteDTO dto = reporteService.obtenerReporte(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
}
