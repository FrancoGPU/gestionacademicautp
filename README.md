# 🎓 Sistema de Gestión Académica UTP

Sistema integral de gestión académica desarrollado con **Spring Boot** y **JavaScript**, que permite administrar estudiantes, profesores, cursos y proyectos académicos con arquitectura **multi-base de datos**.

## � Prerrequisitos

**Puertos requeridos (deben estar disponibles):**
- **3000** - Frontend web
- **8080** - Backend API
- **5432** - PostgreSQL
- **3306** - MySQL
- **27017** - MongoDB
- **6379** - Redis
- **9042** - Cassandra

## �🚀 Inicio Rápido

### Para GitHub Codespaces (Recomendado):

```bash
# Instalación de Python3 (requerido)
sudo apt update && sudo apt install python3 python3-pip

# Configuración automática del proyecto
./scripts/deployment/codespace-setup.sh
```

### Para entornos locales:
```bash
./run.sh start
```

**URLs disponibles:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot 3.x)
- **PostgreSQL**: Gestión de estudiantes
- **MySQL**: Gestión de cursos  
- **Cassandra**: Gestión de profesores
- **MongoDB**: Gestión de proyectos
- **Redis**: Cache y sesiones

### Frontend
- Interfaz web moderna y responsiva
- Sistema de reportes
- Dashboard en tiempo real

## 🎯 Funcionalidades Principales

| Módulo | Funcionalidades |
|--------|----------------|
| 👥 **Estudiantes** | CRUD, asignación de cursos/proyectos, reportes |
| 👨‍🏫 **Profesores** | CRUD, asignación de cursos, especialidades |
| 📚 **Cursos** | CRUD, gestión de créditos, asignación de profesores |
| 🚀 **Proyectos** | CRUD, asignación a estudiantes, gestión de fechas |
| 📈 **Dashboard** | Estadísticas en tiempo real, reportes exportables |

## 📁 Estructura del Proyecto

```
gestionacademicautp/
├── src/                    # Código fuente Java (Spring Boot)
├── frontend/               # Aplicación web
├── scripts/                # Scripts de configuración
│   ├── database/          # Inicialización de BD
│   └── deployment/        # Scripts de despliegue
├── docs/                   # Documentación
├── docker-compose.yml     # Configuración contenedores
└── README.md              # Este archivo
```

## 🔧 Comandos Disponibles

```bash
# Inicio y desarrollo
./run.sh start      # Inicio completo del sistema
./run.sh backend    # Solo backend en puerto 8080
./run.sh frontend   # Solo frontend en puerto 3000

# Bases de datos
./run.sh db         # Solo iniciar bases de datos
./run.sh stop       # Detener bases de datos

# Mantenimiento
./run.sh status     # Ver estado de todos los servicios
./run.sh logs       # Ver logs del backend
./run.sh clean      # Limpiar builds y logs
./run.sh help       # Ver ayuda completa
```

## 🛠️ Tecnologías

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Data JPA
- Spring Data MongoDB
- Spring Data Redis
- PostgreSQL, MySQL, MongoDB, Redis, Cassandra

### Frontend
- JavaScript ES6+
- HTML5 + CSS3
- Fetch API

## 🌐 Endpoints API

### Estudiantes
- `GET /api/estudiantes` - Listar todos
- `GET /api/estudiantes/{id}` - Obtener por ID
- `POST /api/estudiantes` - Crear nuevo
- `PUT /api/estudiantes/{id}` - Actualizar
- `DELETE /api/estudiantes/{id}` - Eliminar

### Cursos
- `GET /api/cursos` - Listar todos
- `GET /api/cursos/{id}` - Obtener por ID
- `POST /api/cursos` - Crear nuevo
- `PUT /api/cursos/{id}` - Actualizar
- `DELETE /api/cursos/{id}` - Eliminar

### Proyectos
- `GET /api/proyectos` - Listar todos
- `GET /api/proyectos/{id}` - Obtener por ID
- `POST /api/proyectos` - Crear nuevo
- `PUT /api/proyectos/{id}` - Actualizar
- `DELETE /api/proyectos/{id}` - Eliminar

### Reportes
- `GET /api/reportes/estudiante/{id}` - Reporte integral

## 🔒 Configuración de Bases de Datos

Las credenciales se configuran en `application.properties` y `docker-compose.yml`:

- **PostgreSQL**: puerto 5432
- **MySQL**: puerto 3306  
- **MongoDB**: puerto 27017
- **Redis**: puerto 6379
- **Cassandra**: puerto 9042

## 📄 Licencia

Proyecto académico - Universidad Tecnológica del Perú (UTP)
