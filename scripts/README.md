# 📁 Scripts del Sistema de Gestión Académica UTP

Esta carpeta contiene todos los scripts organizados del proyecto.

## 📂 Estructura

```
scripts/
├── database/               # Scripts de base de datos
│   ├── init-database.sh   # Script principal de inicialización
│   ├── init-db.sql       # Datos PostgreSQL (estudiantes)
│   ├── init-mysql.sql    # Datos MySQL (cursos)
│   └── init-mongo.js     # Datos MongoDB (proyectos)
│
└── deployment/           # Scripts de deployment y ejecución
    ├── run.sh           # Script principal del sistema
    ├── build.sh         # Script de construcción
    ├── setup.sh         # Script de configuración
    ├── start-services.sh # Inicio de servicios
    ├── codespace-init.sh # Inicialización para Codespaces
    └── verify-system.sh  # Verificación del sistema
```

## 🚀 Scripts Principales

### Base de Datos (`database/`)

#### `init-database.sh`
**Propósito**: Inicializa todas las bases de datos con datos de prueba
**Ejecuta**:
- PostgreSQL: 11 estudiantes
- MySQL: 12 cursos  
- MongoDB: 6 proyectos

```bash
./scripts/database/init-database.sh
```

#### `init-db.sql`
**Propósito**: Script SQL para PostgreSQL
**Contiene**: Tabla `estudiante` y datos de prueba

#### `init-mysql.sql`
**Propósito**: Script SQL para MySQL
**Contiene**: Tabla `cursos` y datos de prueba

#### `init-mongo.js`
**Propósito**: Script JavaScript para MongoDB
**Contiene**: Colección `proyectos_investigacion` y datos de prueba

### Deployment (`deployment/`)

#### `run.sh`
**Propósito**: Script principal para ejecutar todo el sistema
**Funciones**:
- `start`: Inicia sistema completo
- `build`: Solo compila
- `db`: Solo bases de datos
- `backend`: Solo backend
- `frontend`: Solo frontend
- `stop`: Detiene bases de datos

```bash
./scripts/deployment/run.sh start
```

#### `codespace-init.sh`
**Propósito**: Inicialización automática para GitHub Codespaces
**Ejecuta**:
1. Configura permisos
2. Verifica estructura
3. Configura entorno
4. Ejecuta `run.sh start`

#### `verify-system.sh`
**Propósito**: Verifica que todo el sistema esté funcionando
**Verifica**:
- Contenedores Docker
- Conexiones a bases de datos
- APIs del backend
- Frontend

```bash
./scripts/deployment/verify-system.sh
```

## 🔗 Scripts de Compatibilidad

En la raíz del proyecto hay scripts wrapper que mantienen compatibilidad:

- `./run.sh` → `./scripts/deployment/run.sh`
- `./init-database.sh` → `./scripts/database/init-database.sh`

## 📊 Datos de Inicialización

| Script | Base de Datos | Tabla/Colección | Registros | Descripción |
|--------|---------------|-----------------|-----------|-------------|
| `init-db.sql` | PostgreSQL | `estudiante` | 11 | Estudiantes con emails UTP |
| `init-mysql.sql` | MySQL | `cursos` | 12 | Cursos con nombres UTF-8 |
| `init-mongo.js` | MongoDB | `proyectos_investigacion` | 6 | Proyectos de investigación |

## 🛠️ Uso

### Desarrollo Local
```bash
# Iniciar todo
./run.sh start

# Solo reinicializar datos
./init-database.sh

# Verificar sistema
./scripts/deployment/verify-system.sh
```

### GitHub Codespaces
La inicialización es automática. El `codespace-init.sh` se ejecuta automáticamente.

### CI/CD
```bash
# Para pipelines automatizados
./scripts/deployment/build.sh
./scripts/database/init-database.sh
./scripts/deployment/verify-system.sh
```

## 🔧 Mantenimiento

- **Agregar nuevos datos**: Edita los archivos `init-*.sql` o `init-*.js`
- **Nuevos scripts**: Agrega en la carpeta correspondiente (`database/` o `deployment/`)
- **Mantener compatibilidad**: Actualiza los wrappers en la raíz si es necesario
