#!/bin/bash

echo "🚀 Iniciando Sistema de Gestión Académica UTP"
echo "============================================="

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Por favor, inicia Docker y vuelve a intentar."
    exit 1
fi

# Levantar servicios de base de datos
echo "📦 Levantando servicios de base de datos..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando que los servicios estén listos..."
sleep 10

# Verificar conexiones
echo "🔍 Verificando conexiones..."

# PostgreSQL
until docker-compose exec -T postgres pg_isready -U gestionacademica; do
  echo "Esperando PostgreSQL..."
  sleep 2
done

# MySQL
until docker-compose exec -T mysql mysqladmin ping -h"localhost" --silent; do
  echo "Esperando MySQL..."
  sleep 2
done

echo "✅ Servicios de base de datos listos!"
echo ""
echo "🔧 Instrucciones siguientes:"
echo "1. Ejecutar backend: ./mvnw spring-boot:run"
echo "2. Ejecutar frontend: cd frontend && npm start"
echo ""
echo "🌐 URLs del sistema:"
echo "- Backend API: http://localhost:8080"
echo "- Frontend: http://localhost:3000"
echo ""
echo "📊 Acceso a bases de datos:"
echo "- PostgreSQL: localhost:5432 (usuario: gestionacademica)"
echo "- MySQL: localhost:3306 (usuario: gestionacademica)"
echo "- MongoDB: localhost:27017"
echo "- Redis: localhost:6379"
