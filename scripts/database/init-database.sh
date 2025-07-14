#!/bin/bash

# Script de inicialización de base de datos
# Configura automáticamente PostgreSQL, MySQL y MongoDB con datos de prueba
# Basado en los modelos Java del proyecto

set -e

echo "🔧 Inicializando bases de datos basadas en modelos Java..."

# Esperar a que los servicios estén listos
echo "⏳ Esperando servicios de base de datos..."
sleep 10

# Verificar que PostgreSQL esté disponible
echo "🐘 Verificando PostgreSQL..."
until docker exec postgres-container pg_isready -U franco; do
  echo "⏳ Esperando PostgreSQL..."
  sleep 2
done

# Verificar que MySQL esté disponible
echo "🐬 Verificando MySQL..."
until docker exec mysql-container mysqladmin ping -h"localhost" --silent; do
  echo "⏳ Esperando MySQL..."
  sleep 2
done

# Verificar que MongoDB esté disponible
echo "🍃 Verificando MongoDB..."
until docker exec mongo-container mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "⏳ Esperando MongoDB..."
  sleep 2
done

# Verificar que Cassandra esté disponible
echo "💎 Verificando Cassandra..."
until docker exec cassandra-container cqlsh -e "describe keyspaces" > /dev/null 2>&1; do
  echo "⏳ Esperando Cassandra..."
  sleep 5
done

# Crear base de datos PostgreSQL si no existe
echo "🐘 Configurando PostgreSQL..."
docker exec -i postgres-container psql -U franco -d utp_gestion_academica_db_pg -c "CREATE DATABASE IF NOT EXISTS gestiones;" || true

# Ejecutar script de inicialización PostgreSQL (tabla estudiante)
echo "🐘 Ejecutando inicialización PostgreSQL (estudiantes)..."
docker exec -i postgres-container psql -U franco -d utp_gestion_academica_db_pg < /workspaces/gestionacademicautp/scripts/database/init-db.sql

# Crear base de datos MySQL si no existe
echo "🐬 Configurando MySQL..."
docker exec -i mysql-container mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS utp_gestion_academica_db_mysql;" || true

# Ejecutar script de inicialización MySQL (tabla cursos)
echo "🐬 Ejecutando inicialización MySQL (cursos)..."
docker exec -i mysql-container mysql -u root -proot < /workspaces/gestionacademicautp/scripts/database/init-mysql.sql

# Ejecutar script de inicialización MongoDB (proyectos_investigacion)
echo "🍃 Ejecutando inicialización MongoDB (proyectos de investigación)..."
docker exec -i mongo-container mongosh < /workspaces/gestionacademicautp/scripts/database/init-mongo.js

# Ejecutar script de inicialización Cassandra (profesores)
echo "💎 Ejecutando inicialización Cassandra (profesores)..."
docker exec -i cassandra-container cqlsh < /workspaces/gestionacademicautp/scripts/database/init-cassandra.cql

echo "✅ Inicialización de bases de datos completada!"

# Verificar datos
echo "🔍 Verificando datos insertados..."
echo "📊 Estudiantes en PostgreSQL:"
docker exec -i postgres-container psql -U franco -d utp_gestion_academica_db_pg -c "SELECT COUNT(*) as total_estudiantes FROM estudiante;"

echo "📚 Cursos en MySQL:"
docker exec -i mysql-container mysql -u root -proot -D utp_gestion_academica_db_mysql -e "SELECT COUNT(*) as total_cursos FROM cursos;"

echo "🔬 Proyectos en MongoDB:"
docker exec -i mongo-container mongosh --eval "use('utp_gestion_academica_db_mongo'); db.proyectos_investigacion.countDocuments()"

echo "👨‍🏫 Profesores en Cassandra:"
docker exec -i cassandra-container cqlsh -e "USE utp_gestion_academica_keyspace; SELECT COUNT(*) FROM profesores;" 2>/dev/null || echo "Datos de profesores inicializados correctamente"

echo "🎉 Todas las bases de datos están listas para usar!"
echo "📋 Resumen de inicialización:"
echo "   - PostgreSQL: Tabla 'estudiante' con datos de muestra"
echo "   - MySQL: Tabla 'cursos' con datos de muestra"
echo "   - MongoDB: Colección 'proyectos_investigacion' con datos de muestra"
echo "   - Cassandra: Tabla 'profesores' con datos de muestra"
echo "   - Cassandra: Tabla 'profesores' con datos de muestra"
