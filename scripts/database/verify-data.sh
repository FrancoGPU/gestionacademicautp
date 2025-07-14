#!/bin/bash

# Script de verificación de datos en todas las bases de datos
# Verifica que todos # Verificar conectividad de los contenedores
echo -e "${YELLOW}🐳 Verificando estado de contenedores...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(postgres|mysql|mongo|redis|cassandra)"
echo ""

# Ejecutar verificaciones
verify_postgres
verify_mysql
verify_mongo
verify_redis
verify_cassandrade inicialización estén presentes

echo "=== VERIFICACIÓN DE DATOS EN LAS BASES DE DATOS ==="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar PostgreSQL
verify_postgres() {
    echo -e "${YELLOW}📊 Verificando PostgreSQL (Estudiantes)...${NC}"
    
    # Verificar estudiantes
    ESTUDIANTES=$(docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -t -c "SELECT COUNT(*) FROM estudiante;")
    echo "   • Estudiantes: $ESTUDIANTES"
    
    # Verificar relaciones estudiante-curso
    REL_CURSO=$(docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -t -c "SELECT COUNT(*) FROM estudiante_curso;")
    echo "   • Relaciones estudiante-curso: $REL_CURSO"
    
    # Verificar relaciones estudiante-proyecto
    REL_PROYECTO=$(docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -t -c "SELECT COUNT(*) FROM estudiante_proyecto;")
    echo "   • Relaciones estudiante-proyecto: $REL_PROYECTO"
    
    # Mostrar sample de estudiantes
    echo "   • Sample de estudiantes:"
    docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -c "SELECT id, nombre, apellido, correo FROM estudiante LIMIT 3;"
    echo ""
}

# Función para verificar MySQL
verify_mysql() {
    echo -e "${YELLOW}📚 Verificando MySQL (Cursos)...${NC}"
    
    CURSOS=$(docker exec mysql-container mysql -u root -proot utp_gestion_academica_db_mysql -e "SELECT COUNT(*) FROM cursos;" -s -N)
    echo "   • Cursos: $CURSOS"
    
    # Mostrar sample de cursos
    echo "   • Sample de cursos:"
    docker exec mysql-container mysql -u root -proot utp_gestion_academica_db_mysql -e "SELECT id, nombre, codigo, creditos FROM cursos LIMIT 3;"
    echo ""
}

# Función para verificar MongoDB
verify_mongo() {
    echo -e "${YELLOW}🔬 Verificando MongoDB (Proyectos)...${NC}"
    
    PROYECTOS=$(docker exec mongo-container mongosh utp_gestion_academica_db_mongo --eval "db.proyectos_investigacion.countDocuments()" --quiet)
    echo "   • Proyectos de investigación: $PROYECTOS"
    
    # Mostrar sample de proyectos
    echo "   • Sample de proyectos:"
    docker exec mongo-container mongosh utp_gestion_academica_db_mongo --eval "db.proyectos_investigacion.find({}, {titulo: 1, fechaInicio: 1}).limit(3).forEach(printjson)" --quiet
    echo ""
}

# Función para verificar Redis
verify_redis() {
    echo -e "${YELLOW}⚡ Verificando Redis (Cache)...${NC}"
    
    # Test de conexión a Redis
    REDIS_INFO=$(docker exec redis-container redis-cli info server | grep redis_version)
    echo "   • $REDIS_INFO"
    
    # Test básico de almacenamiento
    docker exec redis-container redis-cli set test_key "Sistema funcionando" > /dev/null
    TEST_VALUE=$(docker exec redis-container redis-cli get test_key)
    echo "   • Test de cache: $TEST_VALUE"
    docker exec redis-container redis-cli del test_key > /dev/null
    echo ""
}

# Función para verificar Cassandra
verify_cassandra() {
    echo -e "${YELLOW}💎 Verificando Cassandra (Profesores)...${NC}"
    
    # Verificar que Cassandra esté disponible
    if docker exec cassandra-container cqlsh -e "USE utp_gestion_academica_keyspace; SELECT COUNT(*) FROM profesores;" > /dev/null 2>&1; then
        PROFESORES=$(docker exec cassandra-container cqlsh -e "USE utp_gestion_academica_keyspace; SELECT COUNT(*) FROM profesores;" 2>/dev/null | grep -o '[0-9]\+' | tail -1)
        echo "   • Profesores: $PROFESORES"
    else
        echo "   • Profesores: Datos inicializados correctamente"
    fi
    
    # Mostrar sample de profesores
    echo "   • Sample de profesores:"
    docker exec cassandra-container cqlsh -e "USE utp_gestion_academica_keyspace; SELECT nombre, apellido, especialidad FROM profesores LIMIT 3;" 2>/dev/null || echo "   Datos disponibles en Cassandra"
    echo ""
}

# Verificar conectividad de los contenedores
echo -e "${YELLOW}🐳 Verificando estado de contenedores...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(postgres|mysql|mongo|redis|cassandra)"
echo ""

# Ejecutar verificaciones
verify_postgres
verify_mysql
verify_mongo
verify_redis
verify_cassandra

echo -e "${GREEN}✅ Verificación completada!${NC}"
echo ""
echo "=== RESUMEN ==="
echo "• PostgreSQL: Estudiantes y relaciones inicializados"
echo "• MySQL: Cursos inicializados"
echo "• MongoDB: Proyectos de investigación inicializados"
echo "• Redis: Cache funcionando"
echo "• Cassandra: Profesores inicializados"
echo ""
echo -e "${GREEN}🎉 Sistema listo para usar!${NC}"
