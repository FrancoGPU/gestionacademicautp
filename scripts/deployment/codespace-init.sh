#!/bin/bash

# Script de inicialización para GitHub Codespaces
# Este script se ejecuta automáticamente cuando se crea un nuevo Codespace

echo "🚀 Inicializando Codespace - Sistema de Gestión Académica UTP"
echo "============================================================"

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
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuración inicial
setup_codespace() {
    log_info "Configurando permisos de archivos..."
    chmod +x ./run.sh ./setup.sh ./init-database.sh
    
    log_info "Verificando estructura del proyecto..."
    if [ ! -f "pom.xml" ]; then
        log_error "pom.xml no encontrado. Verifica que estés en el directorio raíz del proyecto."
        exit 1
    fi
    
    if [ ! -f "docker-compose.yml" ]; then
        log_error "docker-compose.yml no encontrado."
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        log_error "Directorio frontend no encontrado."
        exit 1
    fi
    
    log_success "Estructura del proyecto verificada correctamente"
}

# Instalar dependencias adicionales si es necesario
install_dependencies() {
    log_info "Verificando dependencias del sistema..."
    
    # Verificar Java
    if ! command -v java &> /dev/null; then
        log_error "Java no está disponible"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está disponible"
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está disponible"
        exit 1
    fi
    
    log_success "Todas las dependencias están disponibles"
}

# Configurar variables de entorno si es necesario
setup_environment() {
    log_info "Configurando variables de entorno..."
    
    # Crear archivo .env si no existe
    if [ ! -f ".env" ]; then
        log_info "Creando archivo .env con configuración por defecto..."
        cat > .env << EOL
# Configuración del Sistema de Gestión Académica UTP
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
FRONTEND_PORT=3000

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=utp_gestion_academica_db_pg
POSTGRES_USER=franco
POSTGRES_PASSWORD=123456

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=utp_gestion_academica_db_mysql
MYSQL_USER=root
MYSQL_PASSWORD=root

# MongoDB
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=utp_gestion_academica_db_mongo

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
EOL
    fi
    
    log_success "Variables de entorno configuradas"
}

# Función principal
main() {
    log_info "Iniciando configuración automática del Codespace..."
    
    setup_codespace
    install_dependencies
    setup_environment
    
    log_success "✅ Codespace configurado correctamente!"
    log_info "🚀 Iniciando el sistema completo..."
    
    # Ejecutar el script principal
    ./run.sh start
}

# Ejecutar función principal
main "$@"
