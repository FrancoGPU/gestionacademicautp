-- Script de inicialización de PostgreSQL
-- Basado en el modelo Java: pe.edu.utp.gestionacademicautp.model.postgres.Estudiante
-- Se ejecuta automáticamente al iniciar el proyecto

-- ===== POSTGRESQL (Estudiantes) =====
-- Usamos la base de datos existente: utp_gestion_academica_db_pg

-- Configurar encoding UTF-8 para caracteres especiales
SET client_encoding = 'UTF8';

-- Crear tabla estudiante según el modelo Java
CREATE TABLE IF NOT EXISTS estudiante (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE
);

-- Insertar datos de prueba (estudiantes) si no existen
INSERT INTO estudiante (nombre, apellido, correo, fecha_nacimiento) 
SELECT nombre, apellido, correo, fecha_nacimiento::DATE FROM (VALUES 
    ('Juan Carlos', 'González López', 'u23240522@utp.edu.pe', '2001-03-15'),
    ('María Elena', 'Rodríguez Silva', 'u23240523@utp.edu.pe', '2000-08-22'),
    ('Pedro Antonio', 'Martínez Cruz', 'u23240524@utp.edu.pe', '2001-12-10'),
    ('Ana Sofía', 'López Herrera', 'u23240525@utp.edu.pe', '2002-05-18'),
    ('Carlos Alberto', 'Sánchez Morales', 'u23240526@utp.edu.pe', '2001-09-03'),
    ('Luis Fernando', 'García Vásquez', 'u23240527@utp.edu.pe', '2000-11-25'),
    ('Sofía Alejandra', 'Ruiz Mendoza', 'u23240528@utp.edu.pe', '2001-07-14'),
    ('Diego Andrés', 'Vargas Castillo', 'u23240529@utp.edu.pe', '2002-02-28')
) AS nuevos_estudiantes(nombre, apellido, correo, fecha_nacimiento)
WHERE NOT EXISTS (SELECT 1 FROM estudiante WHERE correo = nuevos_estudiantes.correo);

-- Verificar datos insertados
SELECT 'PostgreSQL: Tabla estudiante inicializada correctamente' as mensaje;
SELECT COUNT(*) as total_estudiantes FROM estudiante;
SELECT 'Estudiantes sample:' as info;
SELECT id, nombre, apellido, correo FROM estudiante LIMIT 3;
