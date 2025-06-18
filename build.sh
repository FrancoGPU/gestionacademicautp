#!/bin/bash

echo "🏗️ Compilando y ejecutando Sistema de Gestión Académica UTP"
echo "==========================================================="

# Compilar backend
echo "⚙️ Compilando backend..."
if ./mvnw clean compile; then
    echo "✅ Backend compilado exitosamente"
else
    echo "❌ Error compilando backend"
    exit 1
fi

# Compilar frontend
echo "⚙️ Compilando frontend..."
cd frontend
if npm run build; then
    echo "✅ Frontend compilado exitosamente"
else
    echo "❌ Error compilando frontend"
    exit 1
fi
cd ..

echo ""
echo "🎉 Proyecto compilado exitosamente!"
echo ""
echo "Para ejecutar:"
echo "1. Backend: ./mvnw spring-boot:run"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "O usar el script de servicios: ./start-services.sh"
