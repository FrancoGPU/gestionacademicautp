#!/bin/bash

# Script de inicialización de base de datos
# Este es un wrapper que ejecuta el script real desde la carpeta scripts/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REAL_SCRIPT="$SCRIPT_DIR/scripts/database/init-database.sh"

if [ -f "$REAL_SCRIPT" ]; then
    exec "$REAL_SCRIPT" "$@"
else
    echo "❌ Error: No se encontró el script de BD en scripts/database/init-database.sh"
    exit 1
fi
