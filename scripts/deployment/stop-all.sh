#!/bin/bash

# Script para detener todos los servicios
# Sistema de Gestión Académica UTP

echo "🛑 Deteniendo todos los servicios..."
echo "================================="

# Detener procesos Java (backend)
echo "🚀 Deteniendo backend..."
pkill -f "spring-boot:run" || true
pkill -f "GestionacademicautpApplication" || true

# Detener procesos Python (frontend)
echo "🌐 Deteniendo frontend..."
pkill -f "python3 -m http.server 3000" || true

# Detener contenedores Docker
echo "🗄️ Deteniendo contenedores Docker..."
docker-compose down

# Limpiar logs
echo "🧹 Limpiando logs..."
rm -f backend.log frontend.log

echo "✅ Todos los servicios han sido detenidos"
