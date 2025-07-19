package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.gestionacademicautp.dto.DashboardStatsDTO;
import pe.edu.utp.gestionacademicautp.service.ReportesService;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReportesController {

    private final ReportesService reportesService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            DashboardStatsDTO stats = reportesService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Log error and return empty stats
            return ResponseEntity.ok(new DashboardStatsDTO(0L, 0L, 0L, 0L));
        }
    }
}
