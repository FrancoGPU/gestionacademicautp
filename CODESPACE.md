# 🚀 Guía de Inicio Rápido para GitHub Codespaces

## ⚡ **Inicio en 3 pasos**

### 1. **Crear Codespace**
- Ve al repositorio en GitHub
- Click **"Code"** → **"Codespaces"** → **"Create codespace"**
- Espera que el codespace se inicialice (1-2 minutos)

### 2. **Ejecutar el Sistema**
Una vez que el codespace esté listo, en la terminal ejecuta:
```bash
./run.sh start
```

### 3. **¡Listo!**
El script automáticamente:
- ✅ Verificará que todo esté instalado (Java, Node.js, Docker)
- ✅ Iniciará todas las bases de datos (PostgreSQL, MySQL, MongoDB, Redis)
- ✅ Compilará el backend (Spring Boot)
- ✅ Instalará e iniciará el frontend (React)

## 🌐 **URLs Disponibles**

Después de unos minutos verás:
- **Frontend**: http://localhost:3000 (Interfaz principal)
- **Backend API**: http://localhost:8080 (API REST)

## 🎯 **Funcionalidades Disponibles**

### **Navegación Principal**
- **📚 Estudiantes**: Gestión completa de estudiantes
- **📖 Cursos**: Administración de cursos
- **🔬 Proyectos**: Gestión de proyectos de investigación
- **📊 Reportes**: Reportes integrales de estudiantes

### **Flujo de Prueba Sugerido**
1. **Crear algunos cursos** en la pestaña "Cursos"
2. **Crear algunos proyectos** en la pestaña "Proyectos"
3. **Crear estudiantes** en la pestaña "Estudiantes"
4. **Editar estudiantes** para asignarles cursos y proyectos
5. **Ver reportes** para ver la información consolidada

## 🛠️ **Comandos Adicionales**

Si necesitas reiniciar o hacer algo específico:

```bash
./run.sh help      # Ver todas las opciones
./run.sh stop      # Detener bases de datos
./run.sh start     # Iniciar todo de nuevo
./run.sh build     # Solo compilar sin ejecutar
```

## 🔧 **Solución de Problemas**

### **Si algo no funciona:**
1. **Detener todo**:
   ```bash
   ./run.sh stop
   ```

2. **Reiniciar**:
   ```bash
   ./run.sh start
   ```

3. **Verificar puertos** en el codespace:
   - Pestaña "PORTS" en VS Code
   - Asegúrate que los puertos 3000 y 8080 estén abiertos

### **Si las bases de datos no se conectan:**
```bash
docker-compose down
docker-compose up -d
./run.sh start
```

## 📱 **Acceso desde el Navegador**

GitHub Codespaces automáticamente:
- 🔓 Hace los puertos accesibles desde internet
- 🌐 Proporciona URLs públicas temporales
- 🔒 Mantiene la seguridad con autenticación

Busca las URLs en la pestaña **"PORTS"** de VS Code.

## 🎓 **¿Qué Verás?**

El sistema incluye:
- **Interfaz moderna** con navegación por pestañas
- **Formularios intuitivos** para crear/editar datos
- **Tablas interactivas** con selección y edición
- **Reportes integrales** que muestran información de múltiples bases de datos
- **Actualizaciones en tiempo real** cuando cambias datos

## 💡 **Tips para Codespaces**

- ✅ **Guarda tu trabajo**: Los codespaces se suspenden automáticamente
- ✅ **URLs públicas**: Puedes compartir las URLs con otros temporalmente
- ✅ **Terminal múltiple**: Puedes abrir varias terminales si necesitas
- ✅ **Extensions**: VS Code viene con extensiones útiles preinstaladas

## 🚀 **¡Disfruta explorando el Sistema de Gestión Académica UTP!**

**Sistema completo funcionando en menos de 5 minutos con un solo comando.**
