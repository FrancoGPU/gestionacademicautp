-- Script de inicialización para MySQL
-- Basado en el modelo Java: pe.edu.utp.gestionacademicautp.model.mysql.Curso
-- Cursos con nombres correctamente codificados en UTF-8

-- Configurar encoding UTF-8 para caracteres especiales
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE utp_gestion_academica_db_mysql;

-- Crear tabla cursos según el modelo Java (nombre de tabla: cursos)
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    creditos INT NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de prueba (cursos) con caracteres UTF-8 correctos
INSERT IGNORE INTO cursos (nombre, codigo, creditos) VALUES 
('Programación I', 'PROG101', 4),
('Base de Datos I', 'BD201', 4),
('Ingeniería de Software', 'IS301', 3),
('Desarrollo Web', 'WEB401', 4),
('Matemática Básica', 'MAT101', 3),
('Física I', 'FIS201', 4),
('Cálculo Diferencial', 'CALC301', 4),
('Redes de Computadoras', 'REDES401', 3),
('Programación Orientada a Objetos', 'POO201', 4),
('Estructuras de Datos', 'ED301', 4),
('Sistemas Operativos', 'SO401', 3),
('Arquitectura de Computadoras', 'AC301', 3);

-- Verificar datos insertados
SELECT 'MySQL: Tabla cursos inicializada correctamente' as mensaje;
SELECT COUNT(*) as total_cursos FROM cursos;
SELECT 'Cursos sample:' as info;
SELECT id, nombre, codigo, creditos FROM cursos LIMIT 5;
