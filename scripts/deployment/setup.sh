#!/bin/bash

echo "⚠️  NOTA: Este script es para configuración inicial únicamente"
echo "🚀 Para iniciar el sistema completo, usa: ./run.sh start"
echo ""
echo "🔧 Sistema de Gestión Académica UTP - Configuración"
echo "=================================================="in/bash

echo "🚀 Sistema de Gestión Académica UTP - Inicio Completo"
echo "==================================================="

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker no está ejecutándose. Iniciando Docker..."
    # Note: En GitHub Codespaces, Docker debería estar ya disponible
fi

# Levantar servicios de base de datos si no están corriendo
echo "📦 Verificando servicios de base de datos..."
if ! docker-compose ps | grep -q "Up"; then
    echo "⚙️  Iniciando servicios de base de datos..."
    docker-compose up -d
    echo "⏳ Esperando que los servicios estén listos..."
    sleep 15
else
    echo "✅ Servicios de base de datos ya están ejecutándose"
fi

# Compilar backend
echo "🔧 Compilando backend..."
if ./mvnw compile; then
    echo "✅ Backend compilado exitosamente"
else
    echo "❌ Error compilando backend"
    exit 1
fi

# Verificar frontend
echo "🎨 Verificando frontend..."
cd frontend
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies ya están instaladas"
else
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi
cd ..

echo ""
echo "🎉 ¡Sistema listo para usar!"
echo ""
echo "📋 Comandos disponibles:"
echo "  • Backend (Spring Boot): ./mvnw spring-boot:run"
echo "  • Frontend (React):      cd frontend && npm start"
echo "  • Tests:                 ./mvnw test"
echo "  • Build completo:        ./build.sh"
echo ""
echo "🌐 URLs cuando esté ejecutándose:"
echo "  • Backend API:    http://localhost:8080"
echo "  • Frontend:       http://localhost:3000"
echo ""
echo "📊 Bases de datos disponibles:"
echo "  • MySQL:     localhost:3306 (usuario: Franco, password: 123456)"
echo "  • PostgreSQL: localhost:5432 (usuario: franco, password: 123456)"
echo "  • MongoDB:   localhost:27017"
echo "  • Redis:     localhost:6379"
