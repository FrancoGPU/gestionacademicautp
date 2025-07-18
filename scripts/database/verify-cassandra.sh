#!/bin/bash

# Script para verificar y reparar Cassandra
# Sistema de Gestión Académica UTP

echo "🔍 Verificando Cassandra..."

# Verificar si Cassandra está corriendo
if ! docker exec cassandra-container cqlsh -e "describe keyspaces" 2>/dev/null | grep -q "utp_gestion_academica_keyspace"; then
    echo "⚠️ Keyspace no encontrado. Creando..."
    
    # Ejecutar el script de inicialización
    docker exec cassandra-container cqlsh -f /docker-entrypoint-initdb.d/init-cassandra.cql
    
    # Esperar un poco
    sleep 5
    
    # Verificar nuevamente
    if docker exec cassandra-container cqlsh -e "describe keyspaces" 2>/dev/null | grep -q "utp_gestion_academica_keyspace"; then
        echo "✅ Keyspace creado exitosamente"
    else
        echo "❌ Error al crear keyspace"
        exit 1
    fi
else
    echo "✅ Keyspace ya existe"
fi

# Verificar tablas
echo "🔍 Verificando tablas..."
if docker exec cassandra-container cqlsh -e "describe keyspace utp_gestion_academica_keyspace" 2>/dev/null | grep -q "profesores"; then
    echo "✅ Tabla profesores encontrada"
else
    echo "❌ Tabla profesores no encontrada"
    exit 1
fi

# Verificar datos
echo "🔍 Verificando datos..."
count=$(docker exec cassandra-container cqlsh -e "SELECT COUNT(*) FROM utp_gestion_academica_keyspace.profesores" 2>/dev/null | grep -oE '[0-9]+' | tail -1)
if [ "$count" -gt 0 ]; then
    echo "✅ Datos encontrados: $count profesores"
else
    echo "⚠️ No se encontraron datos en la tabla profesores"
fi

echo "🎉 Verificación de Cassandra completada"
