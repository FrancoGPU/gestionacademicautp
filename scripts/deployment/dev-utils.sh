#!/bin/bash

# Script de utilidades para desarrolladores
# Proporciona comandos útiles para el desarrollo

echo "🛠️ Utilidades de Desarrollo - Sistema Gestión Académica UTP"
echo "=========================================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_help() {
    echo "Comandos disponibles:"
    echo ""
    echo "  ${BLUE}logs${NC}      Ver logs de contenedores"
    echo "  ${BLUE}status${NC}    Estado de todos los servicios"
    echo "  ${BLUE}restart${NC}   Reiniciar un servicio específico"
    echo "  ${BLUE}clean${NC}     Limpiar y reiniciar todo"
    echo "  ${BLUE}test${NC}      Ejecutar tests"
    echo "  ${BLUE}data${NC}      Gestionar datos de prueba"
    echo "  ${BLUE}backup${NC}    Crear backup de datos"
    echo "  ${BLUE}restore${NC}   Restaurar backup"
    echo ""
}

show_logs() {
    case "$1" in
        "backend"|"spring")
            echo "📋 Logs del Backend (Spring Boot):"
            docker logs postgres-container --tail 20
            ;;
        "frontend"|"react")
            echo "📋 Logs del Frontend (React):"
            # El frontend no corre en Docker, pero podemos mostrar logs de npm
            echo "Frontend corre directamente con npm start"
            ;;
        "db"|"database")
            echo "📋 Logs de Bases de Datos:"
            echo "--- PostgreSQL ---"
            docker logs postgres-container --tail 10
            echo "--- MySQL ---"
            docker logs mysql-container --tail 10
            echo "--- MongoDB ---"
            docker logs mongo-container --tail 10
            ;;
        *)
            echo "📋 Logs disponibles: backend, frontend, database"
            ;;
    esac
}

show_status() {
    echo "📊 Estado del Sistema:"
    echo ""
    echo "🐳 Contenedores Docker:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    echo "🌐 APIs disponibles:"
    if curl -s http://localhost:8080/api/estudiantes > /dev/null; then
        echo "  ✅ API Estudiantes: http://localhost:8080/api/estudiantes"
    else
        echo "  ❌ API Estudiantes: No disponible"
    fi
    
    if curl -s http://localhost:8080/api/cursos > /dev/null; then
        echo "  ✅ API Cursos: http://localhost:8080/api/cursos"
    else
        echo "  ❌ API Cursos: No disponible"
    fi
    
    if curl -s http://localhost:8080/api/proyectos > /dev/null; then
        echo "  ✅ API Proyectos: http://localhost:8080/api/proyectos"
    else
        echo "  ❌ API Proyectos: No disponible"
    fi
    
    echo ""
    echo "📊 Datos en bases de datos:"
    
    # PostgreSQL
    if docker exec postgres-container pg_isready -U franco -d utp_gestion_academica_db_pg &> /dev/null; then
        students=$(docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -t -c "SELECT COUNT(*) FROM estudiante;" 2>/dev/null | xargs)
        echo "  📊 PostgreSQL: $students estudiantes"
    else
        echo "  ❌ PostgreSQL: No disponible"
    fi
    
    # MySQL
    if docker exec mysql-container mysqladmin ping -u root -proot --silent &> /dev/null; then
        courses=$(docker exec mysql-container mysql -u root -proot -D utp_gestion_academica_db_mysql -se "SELECT COUNT(*) FROM cursos;" 2>/dev/null)
        echo "  📚 MySQL: $courses cursos"
    else
        echo "  ❌ MySQL: No disponible"
    fi
    
    # MongoDB
    if docker exec mongo-container mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        projects=$(docker exec mongo-container mongosh --eval "use('utp_gestion_academica_db_mongo'); db.proyectos_investigacion.countDocuments()" --quiet 2>/dev/null)
        echo "  🍃 MongoDB: $projects proyectos"
    else
        echo "  ❌ MongoDB: No disponible"
    fi
}

restart_service() {
    case "$1" in
        "db"|"database")
            echo "🔄 Reiniciando bases de datos..."
            docker-compose restart
            sleep 5
            ./scripts/database/init-database.sh
            ;;
        "backend")
            echo "🔄 Reiniciando backend..."
            pkill -f "spring-boot:run" || true
            sleep 2
            ./mvnw spring-boot:run &
            ;;
        "all")
            echo "🔄 Reiniciando todo el sistema..."
            ./scripts/deployment/run.sh stop
            sleep 3
            ./scripts/deployment/run.sh start
            ;;
        *)
            echo "Servicios disponibles: database, backend, all"
            ;;
    esac
}

clean_system() {
    echo "🧹 Limpiando sistema completo..."
    
    # Detener todo
    docker-compose down
    pkill -f "spring-boot:run" || true
    pkill -f "npm start" || true
    
    # Limpiar builds
    ./mvnw clean
    cd frontend && rm -rf node_modules build
    cd ..
    
    # Reiniciar
    echo "🚀 Reiniciando sistema limpio..."
    ./scripts/deployment/run.sh start
}

manage_data() {
    case "$1" in
        "reset")
            echo "🔄 Reinicializando datos..."
            ./scripts/database/init-database.sh
            ;;
        "sample")
            echo "📊 Datos de muestra disponibles:"
            echo "  - PostgreSQL: 11 estudiantes"
            echo "  - MySQL: 12 cursos"
            echo "  - MongoDB: 6 proyectos"
            ;;
        *)
            echo "Opciones: reset, sample"
            ;;
    esac
}

# Función principal
case "${1:-help}" in
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "restart")
        restart_service "$2"
        ;;
    "clean")
        clean_system
        ;;
    "test")
        echo "🧪 Ejecutando tests..."
        ./mvnw test
        ;;
    "data")
        manage_data "$2"
        ;;
    "backup")
        echo "💾 Funcionalidad de backup pendiente de implementar"
        ;;
    "restore")
        echo "📥 Funcionalidad de restore pendiente de implementar"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Comando no válido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
