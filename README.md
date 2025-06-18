# Sistema de Gestión Académica UTP

Sistema integral de gestión académica desarrollado con Spring Boot y React, que permite administrar estudiantes, cursos y proyectos de investigación con múltiples fuentes de datos.

## 🏗️ Arquitectura

### Backend (Spring Boot)
- **PostgreSQL**: Gestión de estudiantes y relaciones
- **MySQL**: Gestión de cursos
- **MongoDB**: Gestión de proyectos de investigación
- **Redis**: Cache para reportes (opcional)

### Frontend (React)
- Interfaz moderna y responsiva
- Gestión completa de entidades
- Reportes integrales en tiempo real

## 🚀 Características

### ✅ Gestión de Estudiantes
- CRUD completo de estudiantes
- Asignación de cursos y proyectos
- Reporte integral individual

### ✅ Gestión de Cursos
- CRUD completo de cursos
- Vista detallada con estudiantes matriculados
- Gestión de créditos y códigos

### ✅ Gestión de Proyectos
- CRUD completo de proyectos de investigación
- Vista detallada con estudiantes participantes
- Fechas de inicio y fin

### ✅ Reportes
- Reporte integral por estudiante
- Consulta de relaciones en tiempo real
- Actualización automática tras ediciones

## 🛠️ Tecnologías

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Data MongoDB
- Spring Data Redis
- PostgreSQL
- MySQL
- MongoDB
- Redis

### Frontend
- React 18
- JavaScript ES6+
- CSS3
- Fetch API

## 📁 Estructura del Proyecto

```
gestionacademicautp/
├── src/main/java/pe/edu/utp/gestionacademicautp/
│   ├── config/          # Configuraciones de bases de datos
│   ├── controller/      # Controladores REST
│   ├── dto/            # Data Transfer Objects
│   ├── model/          # Entidades JPA/MongoDB
│   │   ├── postgres/   # Entidades PostgreSQL
│   │   ├── mysql/      # Entidades MySQL
│   │   └── mongo/      # Entidades MongoDB
│   ├── repository/     # Repositorios por base de datos
│   └── service/        # Lógica de negocio
├── frontend/
│   └── src/
│       ├── components/ # Componentes React organizados
│       │   ├── estudiantes/
│       │   ├── cursos/
│       │   ├── proyectos/
│       │   └── reportes/
│       └── styles/     # Archivos CSS
└── docker-compose.yml  # Configuración de servicios
```

## 🔧 Instalación y Configuración

### 🚀 **Inicio Rápido (Recomendado)**
```bash
./run.sh start
```
**¡Eso es todo!** El script automáticamente:
- ✅ Verifica prerrequisitos
- ✅ Inicia todas las bases de datos (PostgreSQL, MySQL, MongoDB, Redis)
- ✅ Compila el backend (Spring Boot)
- ✅ Instala dependencias del frontend (React)
- ✅ Ejecuta todo el sistema

**URLs disponibles:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080

### 📋 **Prerrequisitos**
- Java 17+ ✅ (incluido en codespaces)
- Node.js 16+ ✅ (incluido en codespaces)
- Docker y Docker Compose ✅ (incluido en codespaces)

### 🛠️ **Comandos Opcionales**
```bash
./run.sh build      # Solo compilar sin ejecutar
./run.sh db         # Solo iniciar bases de datos
./run.sh backend    # Solo backend
./run.sh frontend   # Solo frontend
./run.sh stop       # Detener bases de datos
./run.sh help       # Ver todas las opciones
```

### 🎯 **Para GitHub Codespaces**
1. Abre el repositorio en GitHub
2. Click en "Code" → "Codespaces" → "Create codespace"
3. Espera que el codespace inicie
4. En la terminal ejecuta:
   ```bash
   ./run.sh start
   ```
5. ¡El sistema estará corriendo en minutos!

### 🎯 **Para desarrollo local**
### 🎯 **Para desarrollo local**
1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd gestionacademicautp
   ```
2. Ejecuta el sistema:
   ```bash
   ./run.sh start
   ```

### 🗄️ **Configuración Manual de Base de Datos (Solo si es necesario)**
Conectar a PostgreSQL y ejecutar:
```sql
-- Tabla de relación estudiante-curso
CREATE TABLE estudiante_curso (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id) ON DELETE CASCADE,
    UNIQUE(estudiante_id, curso_id)
);

-- Tabla de relación estudiante-proyecto
CREATE TABLE estudiante_proyecto (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    proyecto_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id) ON DELETE CASCADE,
    UNIQUE(estudiante_id, proyecto_id)
);
```

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

## 🎯 Uso del Sistema

### Navegación Principal
- **Estudiantes**: Gestión completa + Reportes
- **Cursos**: Gestión + Vista detallada
- **Proyectos**: Gestión + Vista detallada

### Flujo de Trabajo
1. **Crear estudiantes, cursos y proyectos**
2. **Editar estudiantes** para asignar cursos y proyectos
3. **Ver reportes** actualizados automáticamente
4. **Usar vistas detalladas** para consultar matriculaciones

## 🔒 Configuración de Bases de Datos

Las credenciales se configuran en `application.properties` y `docker-compose.yml`:

- **PostgreSQL**: puerto 5432
- **MySQL**: puerto 3306  
- **MongoDB**: puerto 27017
- **Redis**: puerto 6379

## 🤝 Contribuciones

Este es un proyecto académico para demostrar la integración de múltiples tecnologías y bases de datos en un sistema de gestión completo.

## 📄 Licencia

Proyecto académico - Universidad Tecnológica del Perú (UTP)
