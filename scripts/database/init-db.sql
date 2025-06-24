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

-- Crear tabla de relación estudiante-curso (many-to-many)
CREATE TABLE IF NOT EXISTS estudiante_curso (
    estudiante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    PRIMARY KEY (estudiante_id, curso_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id) ON DELETE CASCADE
    -- Nota: curso_id hace referencia a MySQL, no creamos FK física
);

-- Crear tabla de relación estudiante-proyecto (many-to-many)
CREATE TABLE IF NOT EXISTS estudiante_proyecto (
    estudiante_id INTEGER NOT NULL,
    proyecto_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (estudiante_id, proyecto_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id) ON DELETE CASCADE
    -- Nota: proyecto_id hace referencia a MongoDB, no creamos FK física
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

-- Insertar relaciones de prueba (estudiante-curso)
INSERT INTO estudiante_curso (estudiante_id, curso_id) 
SELECT estudiante_id, curso_id FROM (VALUES 
    (1, 16), (1, 17),  -- Juan Carlos: Programación I, Base de Datos I
    (2, 18), (2, 19),  -- María Elena: Ingeniería Software, Desarrollo Web
    (3, 16), (3, 20),  -- Pedro Antonio: Programación I, Matemática Básica
    (4, 17), (4, 18),  -- Ana Sofía: Base de Datos I, Ing. Software
    (5, 19), (5, 20)   -- Carlos Alberto: Desarrollo Web, Matemática
) AS relaciones(estudiante_id, curso_id)
WHERE NOT EXISTS (
    SELECT 1 FROM estudiante_curso 
    WHERE estudiante_id = relaciones.estudiante_id 
    AND curso_id = relaciones.curso_id
);

-- Insertar relaciones de prueba (estudiante-proyecto)
INSERT INTO estudiante_proyecto (estudiante_id, proyecto_id) 
SELECT estudiante_id, proyecto_id FROM (VALUES 
    (1, '685a5c56e3f449566d69e328'),  -- Juan Carlos: Sistema Gestión Académica
    (2, '685a5c56e3f449566d69e329'),  -- María Elena: E-learning Inteligente
    (3, '685a5c56e3f449566d69e32a'),  -- Pedro Antonio: App Biblioteca Virtual
    (4, '685a5c56e3f449566d69e328'),  -- Ana Sofía: Sistema Gestión
    (5, '685a5c56e3f449566d69e32b')   -- Carlos Alberto: otro proyecto
) AS relaciones(estudiante_id, proyecto_id)
WHERE NOT EXISTS (
    SELECT 1 FROM estudiante_proyecto 
    WHERE estudiante_id = relaciones.estudiante_id 
    AND proyecto_id = relaciones.proyecto_id
);

-- Verificar datos insertados
SELECT 'PostgreSQL: Tabla estudiante inicializada correctamente' as mensaje;
SELECT COUNT(*) as total_estudiantes FROM estudiante;
SELECT 'Estudiantes sample:' as info;
SELECT id, nombre, apellido, correo FROM estudiante LIMIT 3;

-- Verificar relaciones
SELECT 'Relaciones estudiante-curso:' as info;
SELECT COUNT(*) as total_relaciones_curso FROM estudiante_curso;
SELECT 'Relaciones estudiante-proyecto:' as info;
SELECT COUNT(*) as total_relaciones_proyecto FROM estudiante_proyecto;
