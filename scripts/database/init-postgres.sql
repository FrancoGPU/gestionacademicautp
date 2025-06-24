-- Script de inicialización para PostgreSQL
-- Estudiantes y Proyectos

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE gestiones' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestiones')\gexec

-- Conectar a la base de datos
\c gestiones;

-- Crear tabla estudiantes si no existe
CREATE TABLE IF NOT EXISTS estudiante (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla estudiante_curso si no existe
CREATE TABLE IF NOT EXISTS estudiante_curso (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    curso_codigo VARCHAR(20) NOT NULL,
    semestre VARCHAR(10) NOT NULL,
    nota DECIMAL(4,2),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla estudiante_proyecto si no existe
CREATE TABLE IF NOT EXISTS estudiante_proyecto (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    proyecto_nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'En Proceso',
    fecha_inicio DATE,
    fecha_fin DATE,
    calificacion DECIMAL(4,2)
);

-- Insertar datos de prueba (estudiantes) si no existen
INSERT INTO estudiante (nombre, apellido, codigo, email, telefono) 
SELECT * FROM (VALUES 
    ('Juan Carlos', 'González López', '202312001', 'u202312001@utp.edu.pe', '987654321'),
    ('María Elena', 'Rodríguez Silva', '202312002', 'u202312002@utp.edu.pe', '987654322'),
    ('Pedro Antonio', 'Martínez Cruz', '202312003', 'u202312003@utp.edu.pe', '987654323'),
    ('Ana Sofía', 'López Herrera', '202312004', 'u202312004@utp.edu.pe', '987654324'),
    ('Carlos Alberto', 'Sánchez Morales', '202312005', 'u202312005@utp.edu.pe', '987654325'),
    ('Luis Fernando', 'García Vásquez', '23240522', 'u23240522@utp.edu.pe', '987654326')
) AS nuevos_estudiantes(nombre, apellido, codigo, email, telefono)
WHERE NOT EXISTS (SELECT 1 FROM estudiante WHERE codigo = nuevos_estudiantes.codigo);

-- Insertar relaciones estudiante-curso si no existen
INSERT INTO estudiante_curso (estudiante_id, curso_codigo, semestre, nota)
SELECT e.id, curso_codigo, semestre, nota
FROM estudiante e,
(VALUES 
    ('202312001', 'PROG101', '2024-1', 18.5),
    ('202312001', 'BD201', '2024-1', 17.0),
    ('202312002', 'PROG101', '2024-1', 19.0),
    ('202312002', 'IS301', '2024-1', 16.5),
    ('202312003', 'BD201', '2024-1', 15.5),
    ('202312003', 'IS301', '2024-1', 18.0),
    ('23240522', 'PROG101', '2024-2', 20.0),
    ('23240522', 'BD201', '2024-2', 19.5),
    ('23240522', 'IS301', '2024-2', 18.5)
) AS cursos_data(codigo_estudiante, curso_codigo, semestre, nota)
WHERE e.codigo = cursos_data.codigo_estudiante
AND NOT EXISTS (
    SELECT 1 FROM estudiante_curso ec 
    WHERE ec.estudiante_id = e.id 
    AND ec.curso_codigo = cursos_data.curso_codigo
);

-- Insertar proyectos de estudiantes si no existen
INSERT INTO estudiante_proyecto (estudiante_id, proyecto_nombre, descripcion, estado, fecha_inicio, fecha_fin, calificacion)
SELECT e.id, proyecto_nombre, descripcion, estado, fecha_inicio, fecha_fin, calificacion
FROM estudiante e,
(VALUES 
    ('202312001', 'Sistema de Gestión Académica', 'Desarrollo de una aplicación web para gestión de estudiantes y cursos', 'Completado', '2024-03-01', '2024-06-15', 18.0),
    ('202312002', 'App Móvil de Biblioteca Virtual', 'Aplicación móvil para consulta de libros y recursos digitales', 'En Proceso', '2024-04-01', NULL, NULL),
    ('23240522', 'Plataforma E-learning UTP', 'Sistema completo de educación virtual con videoconferencias', 'En Proceso', '2024-05-01', NULL, NULL)
) AS proyectos_data(codigo_estudiante, proyecto_nombre, descripcion, estado, fecha_inicio, fecha_fin, calificacion)
WHERE e.codigo = proyectos_data.codigo_estudiante
AND NOT EXISTS (
    SELECT 1 FROM estudiante_proyecto ep 
    WHERE ep.estudiante_id = e.id 
    AND ep.proyecto_nombre = proyectos_data.proyecto_nombre
);

\echo 'PostgreSQL: Tablas de estudiantes y proyectos inicializadas correctamente'
