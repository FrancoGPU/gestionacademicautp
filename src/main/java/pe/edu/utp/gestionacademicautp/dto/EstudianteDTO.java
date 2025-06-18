package pe.edu.utp.gestionacademicautp.dto;

import java.util.List;

public class EstudianteDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private java.time.LocalDate fecha_nacimiento;
    private List<Integer> cursoIds;
    private List<String> proyectoIds;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public java.time.LocalDate getFecha_nacimiento() {
        return fecha_nacimiento;
    }

    public void setFecha_nacimiento(java.time.LocalDate fecha_nacimiento) {
        this.fecha_nacimiento = fecha_nacimiento;
    }

    public List<Integer> getCursoIds() {
        return cursoIds;
    }

    public void setCursoIds(List<Integer> cursoIds) {
        this.cursoIds = cursoIds;
    }

    public List<String> getProyectoIds() {
        return proyectoIds;
    }

    public void setProyectoIds(List<String> proyectoIds) {
        this.proyectoIds = proyectoIds;
    }
}
