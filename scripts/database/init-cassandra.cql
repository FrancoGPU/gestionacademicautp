-- Script de inicialización para CassandraDB
-- Basado en el modelo Java: pe.edu.utp.gestionacademicautp.model.cassandra.Profesor
-- Profesores con datos de prueba

-- Crear keyspace si no existe
CREATE KEYSPACE IF NOT EXISTS utp_gestion_academica_keyspace
WITH REPLICATION = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

-- Usar el keyspace
USE utp_gestion_academica_keyspace;

-- Crear tabla profesores según el modelo Java
CREATE TABLE IF NOT EXISTS profesores (
    id UUID PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    correo TEXT,
    especialidad TEXT,
    telefono TEXT,
    grado_academico TEXT,
    anos_experiencia INT,
    activo BOOLEAN,
    curso_ids SET<INT>
);

-- Crear índices para consultas eficientes
CREATE INDEX IF NOT EXISTS profesores_especialidad_idx ON profesores (especialidad);
CREATE INDEX IF NOT EXISTS profesores_grado_idx ON profesores (grado_academico);
CREATE INDEX IF NOT EXISTS profesores_activo_idx ON profesores (activo);
CREATE INDEX IF NOT EXISTS profesores_correo_idx ON profesores (correo);

-- Insertar datos de prueba (profesores)
INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Carlos Eduardo', 'Ramírez López', 'cramirez@utp.edu.pe', 'Ingeniería de Software', '+51-987-654-321', 'Doctor', 15, true, {16, 18});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'María Isabel', 'Fernández García', 'mfernandez@utp.edu.pe', 'Base de Datos', '+51-987-654-322', 'Magister', 12, true, {17});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'José Antonio', 'Silva Mendoza', 'jsilva@utp.edu.pe', 'Programación', '+51-987-654-323', 'Doctor', 18, true, {16});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Ana Lucía', 'Torres Vásquez', 'atorres@utp.edu.pe', 'Desarrollo Web', '+51-987-654-324', 'Magister', 8, true, {19});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Luis Miguel', 'Herrera Castro', 'lherrera@utp.edu.pe', 'Matemáticas', '+51-987-654-325', 'Doctor', 20, true, {20});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Patricia Elena', 'Morales Ruiz', 'pmorales@utp.edu.pe', 'Física', '+51-987-654-326', 'Magister', 10, true, {});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Roberto Carlos', 'Vargas Díaz', 'rvargas@utp.edu.pe', 'Redes de Computadoras', '+51-987-654-327', 'Doctor', 14, true, {});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Sandra Milagros', 'Jiménez Flores', 'sjimenez@utp.edu.pe', 'Sistemas Operativos', '+51-987-654-328', 'Magister', 9, true, {});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Miguel Ángel', 'Bustamante López', 'mbustamante@utp.edu.pe', 'Arquitectura de Computadoras', '+51-987-654-329', 'Doctor', 16, true, {});

INSERT INTO profesores (id, nombre, apellido, correo, especialidad, telefono, grado_academico, anos_experiencia, activo, curso_ids)
VALUES (UUID(), 'Carmen Rosa', 'Delgado Quispe', 'cdelgado@utp.edu.pe', 'Estructuras de Datos', '+51-987-654-330', 'Magister', 7, true, {});

-- Verificar datos insertados
-- Nota: En CQL no hay COUNT(*) directo, pero podemos verificar que los datos existen
SELECT nombre, apellido, especialidad, grado_academico FROM profesores LIMIT 5;
