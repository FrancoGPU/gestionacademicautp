# 🎓 Sistema de Gestión Académica UTP - Guía de Inicio Rápido

## 📋 Descripción del Proyecto

Sistema integral de gestión académica desarrollado con **Spring Boot** y **Vanilla JavaScript** que permite administrar estudiantes, profesores, cursos y proyectos de manera eficiente con soporte para múltiples bases de datos.

## 🚀 Inicio Rápido

### Prerrequisitos
- ☕ **Java 17 o superior**
- 🐳 **Docker & Docker Compose**
- 🐍 **Python 3.x**

### Iniciar el Sistema Completo

```bash
# 1. Clonar y entrar al directorio del proyecto
cd gestionacademicautp

# 2. Iniciar todo el sistema (primera vez)
./run.sh start

# 3. O para inicio rápido (si las DBs ya están iniciadas)
./run.sh quick
```

**¡Eso es todo!** El sistema estará disponible en:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080

## 📖 Comandos Disponibles

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `start` | Iniciar sistema completo | `./run.sh start` |
| `quick` | Inicio rápido (DBs ya iniciadas) | `./run.sh quick` |
| `db` | Solo iniciar bases de datos | `./run.sh db` |
| `backend` | Solo backend | `./run.sh backend` |
| `frontend` | Solo frontend | `./run.sh frontend` |
| `build` | Solo compilar | `./run.sh build` |
| `stop` | Detener bases de datos | `./run.sh stop` |
| `clean` | Limpiar builds y logs | `./run.sh clean` |
| `status` | Ver estado de servicios | `./run.sh status` |
| `logs` | Ver logs del backend | `./run.sh logs` |
| `help` | Mostrar ayuda | `./run.sh help` |

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot 3.5.0)
- **Puerto**: 8080
- **Tecnologías**: Java 17, Maven, Spring Security
- **Bases de datos**:
  - 🐘 PostgreSQL (5432) - Datos principales
  - 🐬 MySQL (3306) - Datos complementarios
  - 🗂️ Cassandra (9042) - Datos distribuidos
  - 🍃 MongoDB (27017) - Documentos y logs
  - 🔴 Redis (6379) - Cache y sesiones

### Frontend (Vanilla JavaScript)
- **Puerto**: 3000
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+
- **Tema**: Glassmorfismo con diseño responsive
- **Servidor**: Python HTTP Server

## 🎯 Funcionalidades Principales

- 👥 **Gestión de Estudiantes**: CRUD completo con validaciones
- 👨‍🏫 **Gestión de Profesores**: Administración de docentes
- 📚 **Gestión de Cursos**: Creación y asignación de materias
- 🚀 **Gestión de Proyectos**: Sistema de proyectos académicos
- 📈 **Reportes y Estadísticas**: Dashboard con métricas en tiempo real
- 🔐 **Sistema de Autenticación**: Login seguro con Redis

## 🔧 Desarrollo y Debugging

### Verificar Estado del Sistema
```bash
./run.sh status
```

### Ver Logs en Tiempo Real
```bash
./run.sh logs
```

### Desarrollo por Componentes
```bash
# Solo bases de datos
./run.sh db

# Solo backend (en otra terminal)
./run.sh backend

# Solo frontend (en otra terminal)
./run.sh frontend
```

### Limpiar y Reiniciar
```bash
# Limpiar builds
./run.sh clean

# Detener todas las bases de datos
./run.sh stop

# Reiniciar sistema completo
./run.sh start
```

## 📁 Estructura del Proyecto

```
gestionacademicautp/
├── 🔧 Backend (Spring Boot)
│   ├── src/main/java/pe/edu/utp/gestionacademicautp/
│   │   ├── controller/          # Controllers REST
│   │   ├── service/            # Lógica de negocio
│   │   ├── repository/         # Acceso a datos
│   │   ├── model/              # Entidades JPA
│   │   ├── dto/               # DTOs
│   │   └── config/            # Configuraciones
│   └── src/main/resources/
│       └── application.properties
├── 🎨 Frontend (Vanilla JS)
│   ├── index.html             # Página principal
│   ├── css/                   # Estilos CSS
│   │   ├── styles.css         # Estilos principales
│   │   └── themes.css         # Tema glassmorfismo
│   └── js/                    # JavaScript
│       ├── app.js             # Aplicación principal
│       ├── auth.js            # Autenticación
│       ├── dashboard.js       # Dashboard
│       ├── estudiantes.js     # Gestión estudiantes
│       ├── profesores.js      # Gestión profesores
│       ├── cursos.js          # Gestión cursos
│       └── proyectos.js       # Gestión proyectos
├── 🗄️ Database
│   ├── docker-compose.yml     # Configuración DBs
│   └── init-database.sh       # Scripts inicialización
└── 📜 Scripts
    ├── run.sh                 # Script principal
    └── scripts/               # Scripts auxiliares
```

## 🚨 Solución de Problemas

### Puerto Ya en Uso
```bash
# Verificar qué está usando el puerto
lsof -i :8080  # Backend
lsof -i :3000  # Frontend

# Detener proceso específico
kill -9 <PID>
```

### Docker No Responde
```bash
# Reiniciar Docker (Linux/Mac)
sudo systemctl restart docker

# Verificar estado
docker info
```

### Backend No Compila
```bash
# Verificar Java
java -version

# Limpiar y recompilar
./mvnw clean compile
```

### Frontend No Carga
```bash
# Verificar Python
python3 --version

# Iniciar servidor manualmente
cd frontend
python3 -m http.server 3000
```

## 📞 Soporte

Para problemas o consultas:
1. Verificar logs: `./run.sh logs`
2. Verificar estado: `./run.sh status`
3. Reiniciar sistema: `./run.sh clean && ./run.sh start`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**🎓 Universidad Tecnológica del Perú (UTP)**  
*Sistema de Gestión Académica - 2024*
