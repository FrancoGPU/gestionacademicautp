#!/bin/bash

# Script para iniciar el frontend del Sistema de Gestión Académica UTP

echo "🚀 Iniciando Sistema de Gestión Académica UTP - Frontend"
echo "=================================================="

# Verificar si estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html. Ejecuta este script desde el directorio frontend."
    exit 1
fi

# Obtener el puerto (por defecto 3000)
PORT=${1:-3000}

echo "📁 Directorio: $(pwd)"
echo "🌐 Puerto: $PORT"
echo ""

# Función para abrir el navegador
open_browser() {
    local url="http://localhost:$PORT"
    echo "🌍 Abriendo navegador en: $url"
    
    if command -v xdg-open > /dev/null; then
        xdg-open "$url" > /dev/null 2>&1
    elif command -v open > /dev/null; then
        open "$url" > /dev/null 2>&1
    elif command -v start > /dev/null; then
        start "$url" > /dev/null 2>&1
    else
        echo "   Por favor, abre manualmente: $url"
    fi
}

# Intentar iniciar servidor con diferentes métodos
start_server() {
    echo "🔍 Buscando servidor web disponible..."
    
    # Verificar Python 3
    if command -v python3 > /dev/null; then
        echo "✅ Usando Python 3"
        echo "   Comando: python3 -m http.server $PORT"
        echo ""
        echo "🎯 Para detener el servidor: Ctrl+C"
        echo "📋 Logs del servidor:"
        echo "----------------------------------------"
        
        # Abrir navegador después de 2 segundos
        (sleep 2 && open_browser) &
        
        python3 -m http.server $PORT
        return
    fi
    
    # Verificar Python 2
    if command -v python2 > /dev/null; then
        echo "✅ Usando Python 2"
        echo "   Comando: python2 -m SimpleHTTPServer $PORT"
        echo ""
        echo "🎯 Para detener el servidor: Ctrl+C"
        echo "📋 Logs del servidor:"
        echo "----------------------------------------"
        
        (sleep 2 && open_browser) &
        python2 -m SimpleHTTPServer $PORT
        return
    fi
    
    # Verificar Node.js
    if command -v node > /dev/null && command -v npx > /dev/null; then
        echo "✅ Usando Node.js (serve)"
        echo "   Comando: npx serve -l $PORT ."
        echo ""
        echo "🎯 Para detener el servidor: Ctrl+C"
        echo "📋 Logs del servidor:"
        echo "----------------------------------------"
        
        (sleep 2 && open_browser) &
        npx serve -l $PORT .
        return
    fi
    
    # Verificar PHP
    if command -v php > /dev/null; then
        echo "✅ Usando PHP"
        echo "   Comando: php -S localhost:$PORT"
        echo ""
        echo "🎯 Para detener el servidor: Ctrl+C"
        echo "📋 Logs del servidor:"
        echo "----------------------------------------"
        
        (sleep 2 && open_browser) &
        php -S localhost:$PORT
        return
    fi
    
    # Si no se encuentra ningún servidor
    echo "❌ No se encontró ningún servidor web disponible."
    echo ""
    echo "📦 Instala una de las siguientes opciones:"
    echo "   • Python 3: sudo apt install python3 (Ubuntu/Debian)"
    echo "   • Node.js: https://nodejs.org/"
    echo "   • PHP: sudo apt install php (Ubuntu/Debian)"
    echo ""
    echo "💡 O usa cualquier servidor web apuntando a este directorio."
    exit 1
}

# Mostrar información adicional
echo "📖 Información del Sistema:"
echo "   • Frontend: HTML5 + CSS3 + JavaScript"
echo "   • Temas: Claro, Oscuro, Glassmorfismo, Neumorfismo"
echo "   • Compatibilidad: Chrome 60+, Firefox 55+, Safari 12+"
echo ""

# Verificar backend
echo "🔍 Verificando backend..."
if curl -s "http://localhost:8080/api/estudiantes" > /dev/null 2>&1; then
    echo "✅ Backend detectado en http://localhost:8080"
else
    echo "⚠️  Backend no detectado en http://localhost:8080"
    echo "   El frontend usará datos mock para desarrollo"
fi
echo ""

# Iniciar servidor
start_server
