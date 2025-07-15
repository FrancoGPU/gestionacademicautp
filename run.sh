#!/bin/bash

# 🎓 Sistema de Gestión Académica UTP - Script de Inicialización
# ==============================================================
# Este script permite inicializar y ejecutar fácilmente todo el proyecto
# Autor: Sistema de Gestión Académica UTP
# Versión: 2.0

set -e  # Salir si hay errores

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar el banner
show_banner() {
    echo -e "${PURPLE}"
    echo "████████████████████████████████████████████████████████████"
    echo "██                                                        ██"
    echo "██   🎓 SISTEMA DE GESTIÓN ACADÉMICA UTP                 ██"
    echo "██                                                        ██"
    echo "██   📚 Gestión integral de estudiantes, profesores,     ██"
    echo "██      cursos y proyectos académicos                    ██"
    echo "██                                                        ██"
    echo "██   🔧 Multi-base de datos: PostgreSQL, MySQL,          ██"
    echo "██      Cassandra, MongoDB, Redis                        ██"
    echo "██                                                        ██"
    echo "████████████████████████████████████████████████████████████"
    echo -e "${NC}"
}

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓ SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠ WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗ ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Verificar prerrequisitos del sistema
check_requirements() {
    log_step "Verificando prerrequisitos del sistema..."
    
    local missing_deps=0
    
    # Verificar Java
    if ! command -v java &> /dev/null; then
        log_error "Java no está instalado. Se requiere Java 17 o superior."
        missing_deps=1
    else
        java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
        log_success "Java detectado: $java_version"
    fi
    
    # Verificar Maven (mvnw wrapper)
    if [ ! -f "./mvnw" ]; then
        log_error "Maven wrapper (mvnw) no encontrado"
        missing_deps=1
    else
        log_success "Maven wrapper encontrado"
    fi
    
    # Verificar Python para el frontend
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        log_error "Python no está instalado. Se requiere para el servidor del frontend."
        missing_deps=1
    else
        log_success "Python detectado"
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Se requiere para las bases de datos."
        missing_deps=1
    else
        log_success "Docker detectado"
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose no está instalado."
        missing_deps=1
    else
        log_success "Docker Compose detectado"
    fi
    
    if [ $missing_deps -eq 1 ]; then
        echo ""
        log_error "Faltan dependencias requeridas. Por favor, instálalas antes de continuar."
        echo ""
        echo "📋 Instalación requerida:"
        echo "   • Java 17 o superior"
        echo "   • Docker & Docker Compose"
        echo "   • Python 3.x"
        echo ""
        exit 1
    fi
    
    log_success "Todos los prerrequisitos están disponibles"
}

# Iniciar bases de datos
start_databases() {
    log_step "Iniciando bases de datos con Docker Compose..."
    
    # Verificar si Docker está corriendo
    if ! docker info &> /dev/null; then
        log_error "Docker no está corriendo. Por favor, inicia Docker primero."
        exit 1
    fi
    
    # Iniciar contenedores
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d
    else
        docker compose up -d
    fi
    
    if [ $? -eq 0 ]; then
        log_success "Contenedores de bases de datos iniciados"
        
        log_info "Esperando que las bases de datos estén listas..."
        echo -n "   "
        for i in {1..15}; do
            echo -n "⏳"
            sleep 1
        done
        echo ""
        
        # Inicializar datos si existe el script
        if [ -f "./scripts/database/init-database.sh" ]; then
            log_step "Inicializando datos en las bases de datos..."
            chmod +x ./scripts/database/init-database.sh
            ./scripts/database/init-database.sh
            if [ $? -eq 0 ]; then
                log_success "Datos de prueba cargados en todas las bases de datos"
            else
                log_warning "Algunos datos no se pudieron inicializar, pero continuamos..."
            fi
        fi
    else
        log_error "Error al iniciar las bases de datos"
        exit 1
    fi
}

# Compilar backend
build_backend() {
    log_step "Compilando backend Spring Boot..."
    
    chmod +x ./mvnw
    ./mvnw clean compile -q
    
    if [ $? -eq 0 ]; then
        log_success "Backend compilado exitosamente"
    else
        log_error "Error al compilar el backend"
        exit 1
    fi
}

# Verificar conectividad del backend
wait_for_backend() {
    log_step "Esperando que el backend esté disponible..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8080/api/reportes/dashboard > /dev/null 2>&1; then
            log_success "Backend disponible en http://localhost:8080"
            return 0
        fi
        
        if [ $((attempt % 5)) -eq 0 ]; then
            log_info "Intento $attempt/$max_attempts - Esperando backend..."
        fi
        
        sleep 2
        ((attempt++))
    done
    
    log_warning "Backend tardó más de lo esperado en iniciarse"
    return 1
}

# Iniciar frontend
start_frontend() {
    log_step "Iniciando servidor frontend en puerto 3000..."
    
    cd frontend
    
    # Verificar si existe start.sh, si no, usar Python
    if [ -f "./start.sh" ]; then
        chmod +x ./start.sh
        ./start.sh > /dev/null 2>&1 &
    else
        # Intentar con python3 primero, luego python
        if command -v python3 &> /dev/null; then
            python3 -m http.server 3000 > /dev/null 2>&1 &
        elif command -v python &> /dev/null; then
            python -m http.server 3000 > /dev/null 2>&1 &
        else
            log_error "No se pudo iniciar el servidor frontend"
            cd ..
            return 1
        fi
    fi
    
    FRONTEND_PID=$!
    cd ..
    
    # Verificar que el frontend esté corriendo
    sleep 3
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend disponible en http://localhost:3000"
        return 0
    else
        log_warning "Frontend puede tardar unos segundos en estar disponible"
        return 0
    fi
}

# Ejecutar aplicación completa
run_full_application() {
    log_step "Iniciando sistema completo..."
    
    # Iniciar backend en background
    log_info "Iniciando backend Spring Boot..."
    ./mvnw spring-boot:run > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Esperar backend
    wait_for_backend
    
    # Iniciar frontend
    start_frontend
    
    echo ""
    log_success "🚀 Sistema de Gestión Académica UTP iniciado completamente!"
    echo ""
    echo -e "${CYAN}📍 URLs disponibles:${NC}"
    echo -e "   🌐 Frontend:     ${GREEN}http://localhost:3000${NC}"
    echo -e "   🔧 Backend API:  ${GREEN}http://localhost:8080${NC}"
    echo -e "   📊 Dashboard:    ${GREEN}http://localhost:3000#dashboard${NC}"
    echo ""
    echo -e "${CYAN}📋 Funcionalidades disponibles:${NC}"
    echo "   • 👥 Gestión de Estudiantes"
    echo "   • 👨‍🏫 Gestión de Profesores"
    echo "   • 📚 Gestión de Cursos"
    echo "   • 🚀 Gestión de Proyectos"
    echo "   • 📈 Reportes y Estadísticas"
    echo ""
    echo -e "${YELLOW}⚡ Para detener el sistema, presiona Ctrl+C${NC}"
    echo ""
    
    # Función para limpiar procesos al salir
    cleanup() {
        echo ""
        log_info "Deteniendo aplicaciones..."
        
        [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null
        [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null
        
        # Detener bases de datos si se especifica
        if [ "$1" = "full" ]; then
            log_info "Deteniendo bases de datos..."
            if command -v docker-compose &> /dev/null; then
                docker-compose down > /dev/null 2>&1
            else
                docker compose down > /dev/null 2>&1
            fi
        fi
        
        # Limpiar archivos de log
        [ -f "backend.log" ] && rm -f backend.log
        
        log_success "Sistema detenido correctamente"
        exit 0
    }
    
    # Capturar señales de salida
    trap 'cleanup full' SIGINT SIGTERM
    
    # Mantener el script corriendo
    wait
}

# Mostrar ayuda
show_help() {
    echo -e "${CYAN}🎓 Sistema de Gestión Académica UTP${NC}"
    echo ""
    echo -e "${BLUE}DESCRIPCIÓN:${NC}"
    echo "   Sistema integral para la gestión académica con arquitectura multi-base de datos"
    echo ""
    echo -e "${BLUE}USO:${NC}"
    echo "   ./run.sh [COMANDO]"
    echo ""
    echo -e "${BLUE}COMANDOS:${NC}"
    echo -e "   ${GREEN}start${NC}        Iniciar sistema completo (recomendado)"
    echo -e "   ${GREEN}quick${NC}        Inicio rápido (asume DBs ya iniciadas)"
    echo -e "   ${GREEN}db${NC}           Solo iniciar bases de datos"
    echo -e "   ${GREEN}backend${NC}      Solo compilar e iniciar backend"
    echo -e "   ${GREEN}frontend${NC}     Solo iniciar frontend"
    echo -e "   ${GREEN}build${NC}        Solo compilar el proyecto"
    echo -e "   ${GREEN}stop${NC}         Detener bases de datos"
    echo -e "   ${GREEN}clean${NC}        Limpiar builds y logs"
    echo -e "   ${GREEN}status${NC}       Verificar estado de servicios"
    echo -e "   ${GREEN}logs${NC}         Mostrar logs del backend"
    echo -e "   ${GREEN}help${NC}         Mostrar esta ayuda"
    echo ""
    echo -e "${BLUE}EJEMPLOS:${NC}"
    echo "   ./run.sh start       # Primera vez o inicio completo"
    echo "   ./run.sh quick       # Inicio rápido para desarrollo"
    echo "   ./run.sh stop        # Solo detener bases de datos"
    echo "   ./run.sh status      # Verificar qué está corriendo"
    echo ""
    echo -e "${BLUE}PUERTOS UTILIZADOS:${NC}"
    echo "   • Frontend:   3000"
    echo "   • Backend:    8080"
    echo "   • PostgreSQL: 5432"
    echo "   • MySQL:      3306"
    echo "   • Cassandra:  9042"
    echo "   • MongoDB:    27017"
    echo "   • Redis:      6379"
}

# Verificar estado de servicios
check_status() {
    log_step "Verificando estado de servicios..."
    echo ""
    
    # Verificar bases de datos
    echo -e "${CYAN}📊 Estado de Bases de Datos:${NC}"
    if command -v docker-compose &> /dev/null; then
        docker-compose ps
    else
        docker compose ps
    fi
    echo ""
    
    # Verificar backend
    echo -e "${CYAN}🔧 Backend (Puerto 8080):${NC}"
    if curl -s http://localhost:8080/api/reportes/dashboard > /dev/null 2>&1; then
        echo -e "   ${GREEN}✓ Disponible${NC}"
    else
        echo -e "   ${RED}✗ No disponible${NC}"
    fi
    
    # Verificar frontend
    echo -e "${CYAN}🌐 Frontend (Puerto 3000):${NC}"
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "   ${GREEN}✓ Disponible${NC}"
    else
        echo -e "   ${RED}✗ No disponible${NC}"
    fi
    echo ""
}

# Función principal
main() {
    show_banner
    
    case "${1:-start}" in
        "start")
            check_requirements
            start_databases
            build_backend
            run_full_application
            ;;
        "quick")
            log_info "Inicio rápido (asumiendo que las DBs ya están iniciadas)..."
            check_requirements
            build_backend
            run_full_application
            ;;
        "build")
            check_requirements
            build_backend
            log_success "✨ Proyecto compilado exitosamente"
            ;;
        "db")
            start_databases
            log_success "✨ Bases de datos iniciadas. Usa './run.sh backend' para iniciar el backend."
            ;;
        "backend")
            check_requirements
            build_backend
            log_info "Iniciando solo el backend en puerto 8080..."
            ./mvnw spring-boot:run
            ;;
        "frontend")
            log_info "Iniciando solo el frontend en puerto 3000..."
            start_frontend
            log_success "Frontend iniciado. Presiona Ctrl+C para detener."
            wait
            ;;
        "stop")
            log_info "Deteniendo bases de datos..."
            if command -v docker-compose &> /dev/null; then
                docker-compose down
            else
                docker compose down
            fi
            log_success "✨ Bases de datos detenidas"
            ;;
        "clean")
            log_info "Limpiando builds anteriores y logs..."
            ./mvnw clean -q
            rm -f backend.log
            rm -f nohup.out
            log_success "✨ Limpieza completada"
            ;;
        "status")
            check_status
            ;;
        "logs")
            if [ -f "backend.log" ]; then
                log_info "Mostrando logs del backend (Ctrl+C para salir):"
                tail -f backend.log
            else
                log_warning "No se encontraron logs del backend"
            fi
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Comando no válido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"
