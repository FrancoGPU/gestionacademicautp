# 🎓 Sistema de Gestión Académica UTP - Guía de Inicio Rápido

## 🚀 Inicio Rápido (Una sola línea)

```bash
./run.sh start
```

¡Eso es todo! El script se encargará de todo automáticamente.

## 📋 Qué incluye este comando

✅ **Verificación automática** de dependencias (Java, Docker, Python)  
✅ **Inicio de bases de datos** (PostgreSQL, MySQL, Cassandra, MongoDB, Redis)  
✅ **Carga de datos de prueba** en todas las bases de datos  
✅ **Compilación del backend** Spring Boot  
✅ **Inicio del servidor backend** en puerto 8080  
✅ **Inicio del servidor frontend** en puerto 3000  
✅ **Verificación de conectividad** entre servicios  

## 🌐 URLs Disponibles

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Documentación API**: http://localhost:8080/swagger-ui.html

## 📚 Funcionalidades del Sistema

### 👥 Gestión de Estudiantes
- CRUD completo de estudiantes
- Asignación de cursos y proyectos
- Búsqueda y filtrado avanzado
- Exportación de reportes

### 👨‍🏫 Gestión de Profesores
- CRUD completo de profesores
- Asignación de cursos
- Gestión de especialidades y experiencia
- Reportes de profesores

### 📚 Gestión de Cursos
- CRUD completo de cursos
- Gestión de créditos y códigos
- Asignación de profesores
- Reportes de cursos

### 🚀 Gestión de Proyectos
- CRUD completo de proyectos
- Asignación a estudiantes
- Gestión de fechas y estados
- Reportes de proyectos

### 📈 Dashboard y Reportes
- Dashboard con estadísticas en tiempo real
- Reportes exportables en CSV
- Estadísticas de todas las entidades
- Datos en tiempo real de múltiples bases de datos

## 🔧 Comandos Adicionales

### Desarrollo
```bash
./run.sh quick      # Inicio rápido (asume DBs iniciadas)
./run.sh backend    # Solo backend
./run.sh frontend   # Solo frontend
./run.sh build      # Solo compilar
```

### Gestión de Bases de Datos
```bash
./run.sh db         # Solo iniciar bases de datos
./run.sh stop       # Detener bases de datos
```

### Mantenimiento
```bash
./run.sh status     # Ver estado de servicios
./run.sh logs       # Ver logs del backend
./run.sh clean      # Limpiar builds y logs
```

### Ayuda
```bash
./run.sh help       # Ver ayuda completa
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.0** - Framework principal
- **Java 17+** - Lenguaje de programación
- **Maven** - Gestión de dependencias
- **Multi-base de datos**:
  - PostgreSQL (Estudiantes)
  - MySQL (Cursos)
  - Cassandra (Profesores)
  - MongoDB (Proyectos)
  - Redis (Cache y sesiones)

### Frontend
- **JavaScript Vanilla** - Sin frameworks pesados
- **HTML5 + CSS3** - Interfaz moderna y responsiva
- **Python HTTP Server** - Servidor de desarrollo

### DevOps
- **Docker & Docker Compose** - Contenedores de bases de datos
- **Bash Scripts** - Automatización de despliegue

## 🔍 Resolución de Problemas

### El sistema no inicia
```bash
# Verificar que Docker esté corriendo
docker --version

# Verificar puertos disponibles
./run.sh status

# Limpiar y reiniciar
./run.sh clean
./run.sh start
```

### Problemas con bases de datos
```bash
# Reiniciar solo las bases de datos
./run.sh stop
./run.sh db
```

### Problemas con el backend
```bash
# Ver logs del backend
./run.sh logs

# Reiniciar solo el backend
./run.sh backend
```

## 📁 Estructura del Proyecto

```
gestionacademicautp/
├── run.sh                 # Script principal de inicio
├── src/                   # Código fuente del backend
├── frontend/              # Aplicación web frontend
├── scripts/               # Scripts de automatización
├── docker-compose.yml     # Configuración de bases de datos
└── docs/                  # Documentación
```

## 🤝 Contribuir

1. Clona el repositorio
2. Ejecuta `./run.sh start`
3. Desarrolla nuevas funcionalidades
4. Prueba con `./run.sh build`
5. Envía un pull request

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs con `./run.sh logs`
2. Verifica el estado con `./run.sh status`
3. Intenta limpiar y reiniciar con `./run.sh clean && ./run.sh start`

---

**¡Listo! Tu sistema de gestión académica está funcionando. Disfruta desarrollando! 🚀**
