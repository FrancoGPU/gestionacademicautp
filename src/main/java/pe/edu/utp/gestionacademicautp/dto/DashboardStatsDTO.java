package pe.edu.utp.gestionacademicautp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalEstudiantes;
    private Long totalProfesores;
    private Long totalCursos;
    private Long totalProyectos;
}
