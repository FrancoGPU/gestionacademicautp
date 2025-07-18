#!/bin/bash

# Script de configuración automática para GitHub Codespaces
# Sistema de Gestión Académica UTP

echo "🚀 Configurando GitHub Codespace para Sistema de Gestión Académica UTP"
echo "================================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# Paso 1: Detener servicios existentes
echo "🛑 Deteniendo servicios existentes..."
docker-compose down || true

# Paso 2: Limpiar volúmenes de Docker (opcional)
echo "🧹 Limpiando volúmenes de Docker..."
docker volume prune -f || true

# Paso 3: Levantar los servicios de base de datos
echo "🗄️ Iniciando servicios de base de datos..."
docker-compose up -d mysql postgres mongo redis cassandra

# Paso 4: Esperar a que las bases de datos estén listas
echo "⏳ Esperando a que las bases de datos estén listas..."
echo "   Esto puede tomar 1-2 minutos..."

# Esperar MySQL
echo "   📊 Esperando MySQL..."
while ! docker exec mysql-container mysqladmin ping -h localhost --silent; do
    sleep 2
done
echo "   ✅ MySQL listo"

# Esperar PostgreSQL
echo "   🐘 Esperando PostgreSQL..."
while ! docker exec postgres-container pg_isready -U franco; do
    sleep 2
done
echo "   ✅ PostgreSQL listo"

# Esperar MongoDB
echo "   🍃 Esperando MongoDB..."
while ! docker exec mongo-container mongosh --eval "db.adminCommand('ping')" --quiet; do
    sleep 2
done
echo "   ✅ MongoDB listo"

# Esperar Redis
echo "   🔴 Esperando Redis..."
while ! docker exec redis-container redis-cli ping | grep -q PONG; do
    sleep 2
done
echo "   ✅ Redis listo"

# Esperar Cassandra (toma más tiempo)
echo "   🪐 Esperando Cassandra (puede tomar hasta 2 minutos)..."
CASSANDRA_READY=false
CASSANDRA_TIMEOUT=120  # 2 minutos
CASSANDRA_ELAPSED=0

# Primero esperar a que Cassandra esté básicamente funcionando
echo "   🔄 Esperando que Cassandra inicie..."
while [ $CASSANDRA_ELAPSED -lt $CASSANDRA_TIMEOUT ]; do
    if docker exec cassandra-container cqlsh -e "describe keyspaces" 2>/dev/null | grep -q "system"; then
        echo "   ✅ Cassandra está funcionando"
        CASSANDRA_READY=true
        break
    fi
    echo "   ⏳ Cassandra iniciando... ($CASSANDRA_ELAPSED/$CASSANDRA_TIMEOUT segundos)"
    sleep 10
    CASSANDRA_ELAPSED=$((CASSANDRA_ELAPSED + 10))
done

if [ "$CASSANDRA_READY" = false ]; then
    echo "   ⚠️ Cassandra tardó demasiado en iniciar. Continuando sin él..."
    echo "   💡 Puedes verificar Cassandra después con: ./scripts/database/verify-cassandra.sh"
else
    # Paso 5: Verificar que el keyspace de Cassandra se creó correctamente
    echo "🔍 Verificando keyspace de Cassandra..."
    sleep 5  # Dar tiempo para que se ejecute el script de inicialización
    
    if docker exec cassandra-container cqlsh -e "describe keyspace utp_gestion_academica_keyspace" 2>/dev/null | grep -q "profesores"; then
        echo "   ✅ Keyspace y tablas de Cassandra creados correctamente"
    else
        echo "   ⚠️ Recreando keyspace de Cassandra..."
        docker exec cassandra-container cqlsh -f /docker-entrypoint-initdb.d/init-cassandra.cql
        sleep 5
        if docker exec cassandra-container cqlsh -e "describe keyspace utp_gestion_academica_keyspace" 2>/dev/null | grep -q "profesores"; then
            echo "   ✅ Keyspace recreado exitosamente"
        else
            echo "   ⚠️ No se pudo crear el keyspace. Continuando sin Cassandra..."
        fi
    fi
fi

# Paso 6: Mostrar estado de los servicios
echo "📊 Estado de los servicios:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Paso 7: Hacer el build del backend
echo "🏗️ Compilando backend..."
./mvnw clean compile -DskipTests

# Paso 8: Iniciar el backend en background
echo "🚀 Iniciando backend..."
./mvnw spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

echo "   Backend iniciado con PID: $BACKEND_PID"

# Paso 9: Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
sleep 15

# Verificar que el backend esté respondiendo
for i in {1..10}; do
    if curl -s http://localhost:8080/api/estudiantes > /dev/null 2>&1; then
        echo "   ✅ Backend listo en http://localhost:8080"
        break
    fi
    echo "   ⏳ Intentando conectar al backend ($i/10)..."
    sleep 5
done

# Paso 10: Iniciar el frontend
echo "🌐 Iniciando frontend..."
cd frontend
python3 -m http.server 3000 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "   Frontend iniciado con PID: $FRONTEND_PID"

# Paso 11: Mostrar información final
echo ""
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo "📍 Servicios disponibles:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🚀 Backend API: http://localhost:8080"
echo "   📊 MySQL: localhost:3306"
echo "   🐘 PostgreSQL: localhost:5432"
echo "   🍃 MongoDB: localhost:27017"
echo "   🔴 Redis: localhost:6379"
echo "   🪐 Cassandra: localhost:9042"
echo ""
echo "📋 Para ver los logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo "   Docker: docker-compose logs -f"
echo ""
echo "🛑 Para detener todo:"
echo "   ./scripts/deployment/stop-all.sh"
echo ""
echo "🔗 Abre el frontend en el navegador:"
echo "   http://localhost:3000"
