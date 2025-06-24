#!/bin/bash

# Script para construir y ejecutar el Sistema de Gestión Académica UTP
echo "🎓 Sistema de Gestión Académica UTP - Build Script"
echo "================================================="

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
check_requirements() {
    log_info "Verificando prerrequisitos..."
    
    if ! command -v java &> /dev/null; then
        log_error "Java no está instalado"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    log_success "Todos los prerrequisitos están instalados"
}

# Iniciar bases de datos
start_databases() {
    log_info "Iniciando bases de datos con Docker Compose..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log_success "Bases de datos iniciadas correctamente"
        log_info "Esperando 15 segundos para que las bases de datos estén listas..."
        sleep 15
        
        # Inicializar datos en las bases de datos
        log_info "Inicializando datos en las bases de datos..."
        if [ -f "./scripts/database/init-database.sh" ]; then
            chmod +x ./scripts/database/init-database.sh
            ./scripts/database/init-database.sh
            if [ $? -eq 0 ]; then
                log_success "Datos inicializados correctamente en todas las bases de datos"
            else
                log_warning "Hubo algunos problemas al inicializar los datos, pero continuamos..."
            fi
        else
            log_warning "Script de inicialización de datos no encontrado"
        fi
    else
        log_error "Error al iniciar las bases de datos"
        exit 1
    fi
}

# Construir backend
build_backend() {
    log_info "Construyendo backend (Spring Boot)..."
    ./mvnw clean compile
    
    if [ $? -eq 0 ]; then
        log_success "Backend compilado exitosamente"
    else
        log_error "Error al compilar el backend"
        exit 1
    fi
}

# Construir frontend
build_frontend() {
    log_info "Construyendo frontend (React)..."
    cd frontend
    npm install
    
    if [ $? -eq 0 ]; then
        log_success "Dependencias del frontend instaladas"
    else
        log_error "Error al instalar dependencias del frontend"
        exit 1
    fi
    
    cd ..
}

# Ejecutar aplicación completa
run_application() {
    log_info "Iniciando el sistema completo..."
    
    # Iniciar backend en background
    log_info "Iniciando backend en puerto 8080..."
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    
    # Esperar a que el backend inicie
    log_info "Esperando que el backend inicie completamente..."
    sleep 20
    
    # Verificar que el backend esté corriendo
    log_info "Verificando conexión del backend..."
    for i in {1..10}; do
        if curl -s http://localhost:8080/api/estudiantes > /dev/null; then
            log_success "Backend iniciado correctamente en http://localhost:8080"
            break
        else
            log_info "Intento $i/10 - Esperando que el backend esté listo..."
            sleep 5
        fi
    done
    
    # Iniciar frontend
    log_info "Iniciando frontend en puerto 3000..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    log_success "🚀 Sistema iniciado completamente!"
    echo ""
    echo "📍 URLs disponibles:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo ""
    echo "⚡ Para detener el sistema, presiona Ctrl+C"
    echo ""
    
    # Función para limpiar procesos al salir
    cleanup() {
        log_info "Deteniendo aplicaciones..."
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
        docker-compose down
        log_success "Sistema detenido correctamente"
        exit 0
    }
    
    # Capturar señal de salida
    trap cleanup SIGINT SIGTERM
    
    # Mantener el script corriendo
    wait
}

# Función para mostrar ayuda
show_help() {
    echo "🎓 Sistema de Gestión Académica UTP"
    echo ""
    echo "Uso: ./build.sh [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  start      Iniciar todo el sistema (bases de datos + backend + frontend)"
    echo "  build      Solo compilar el proyecto"
    echo "  db         Solo iniciar bases de datos"
    echo "  backend    Solo compilar e iniciar backend"
    echo "  frontend   Solo iniciar frontend"
    echo "  stop       Detener bases de datos"
    echo "  clean      Limpiar builds anteriores"
    echo "  help       Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./build.sh start     # Iniciar sistema completo"
    echo "  ./build.sh build     # Solo compilar"
    echo "  ./build.sh stop      # Detener bases de datos"
}

# Función principal
main() {
    case "${1:-start}" in
        "start")
            check_requirements
            start_databases
            build_backend
            build_frontend
            run_application
            ;;
        "build")
            check_requirements
            build_backend
            build_frontend
            log_success "Proyecto compilado exitosamente"
            ;;
        "db")
            start_databases
            ;;
        "backend")
            check_requirements
            build_backend
            log_info "Iniciando solo el backend..."
            ./mvnw spring-boot:run
            ;;
        "frontend")
            log_info "Iniciando solo el frontend..."
            cd frontend && npm start
            ;;
        "stop")
            log_info "Deteniendo bases de datos..."
            docker-compose down
            log_success "Bases de datos detenidas"
            ;;
        "clean")
            log_info "Limpiando builds anteriores..."
            ./mvnw clean
            cd frontend && rm -rf node_modules package-lock.json
            log_success "Limpieza completada"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Opción no válida: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
