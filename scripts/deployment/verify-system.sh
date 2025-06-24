#!/bin/bash

# Script de verificación del Sistema de Gestión Académica UTP
# Verifica que todos los componentes estén funcionando correctamente

echo "🔍 Verificación del Sistema de Gestión Académica UTP"
echo "================================================="

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[❌ ERROR]${NC} $1"
}

# Verificar contenedores Docker
check_docker_containers() {
    log_info "Verificando contenedores Docker..."
    
    containers=("postgres-container" "mysql-container" "mongo-container" "redis-container")
    all_running=true
    
    for container in "${containers[@]}"; do
        if docker container inspect "$container" &> /dev/null; then
            status=$(docker container inspect -f '{{.State.Status}}' "$container")
            if [ "$status" = "running" ]; then
                log_success "$container está ejecutándose"
            else
                log_error "$container no está ejecutándose (status: $status)"
                all_running=false
            fi
        else
            log_error "$container no existe"
            all_running=false
        fi
    done
    
    return $([[ "$all_running" == true ]] && echo 0 || echo 1)
}

# Verificar bases de datos
check_databases() {
    log_info "Verificando conexiones a bases de datos..."
    
    # PostgreSQL
    if docker exec postgres-container pg_isready -U franco -d utp_gestion_academica_db_pg &> /dev/null; then
        student_count=$(docker exec postgres-container psql -U franco -d utp_gestion_academica_db_pg -t -c "SELECT COUNT(*) FROM estudiante;" 2>/dev/null | xargs)
        if [ "$student_count" -gt 0 ]; then
            log_success "PostgreSQL: $student_count estudiantes"
        else
            log_warning "PostgreSQL conectado pero sin datos"
        fi
    else
        log_error "PostgreSQL no está accesible"
    fi
    
    # MySQL
    if docker exec mysql-container mysqladmin ping -u root -proot --silent &> /dev/null; then
        course_count=$(docker exec mysql-container mysql -u root -proot -D utp_gestion_academica_db_mysql -se "SELECT COUNT(*) FROM cursos;" 2>/dev/null)
        if [ "$course_count" -gt 0 ]; then
            log_success "MySQL: $course_count cursos"
        else
            log_warning "MySQL conectado pero sin datos"
        fi
    else
        log_error "MySQL no está accesible"
    fi
    
    # MongoDB
    if docker exec mongo-container mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        project_count=$(docker exec mongo-container mongosh --eval "use('utp_gestion_academica_db_mongo'); db.proyectos_investigacion.countDocuments()" --quiet 2>/dev/null)
        if [ "$project_count" -gt 0 ]; then
            log_success "MongoDB: $project_count proyectos"
        else
            log_warning "MongoDB conectado pero sin datos"
        fi
    else
        log_error "MongoDB no está accesible"
    fi
}

# Verificar APIs del backend
check_backend_apis() {
    log_info "Verificando APIs del backend..."
    
    apis=("estudiantes" "cursos" "proyectos")
    
    for api in "${apis[@]}"; do
        if curl -s "http://localhost:8080/api/$api" | jq . &> /dev/null; then
            count=$(curl -s "http://localhost:8080/api/$api" | jq length)
            log_success "API $api: $count registros"
        else
            log_error "API $api no está accesible"
        fi
    done
}

# Verificar frontend
check_frontend() {
    log_info "Verificando frontend..."
    
    if curl -s http://localhost:3000 &> /dev/null; then
        log_success "Frontend está accesible en puerto 3000"
    else
        log_warning "Frontend no está accesible en puerto 3000"
    fi
}

# Función principal
main() {
    log_info "Iniciando verificación completa del sistema..."
    echo ""
    
    check_docker_containers
    echo ""
    
    check_databases
    echo ""
    
    check_backend_apis
    echo ""
    
    check_frontend
    echo ""
    
    log_info "🎉 Verificación completada!"
    echo ""
    echo "📊 URLs disponibles:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo "   API Estudiantes: http://localhost:8080/api/estudiantes"
    echo "   API Cursos: http://localhost:8080/api/cursos"
    echo "   API Proyectos: http://localhost:8080/api/proyectos"
}

# Ejecutar función principal
main "$@"
