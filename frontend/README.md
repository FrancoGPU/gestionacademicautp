# Sistema de Gestión Académica UTP - Frontend

Este es el frontend del Sistema de Gestión Académica de la Universidad Tecnológica del Perú, desarrollado con **HTML5, CSS3 y JavaScript vanilla** (sin frameworks como React).

## 🚀 Características

- **Interfaz moderna y responsiva** - Funciona en desktop, tablet y móvil
- **Múltiples temas** - Claro, Oscuro, Glassmorfismo y Neumorfismo
- **Sistema de navegación SPA** - Experiencia de aplicación de una sola página
- **Gestión completa** - Estudiantes, Profesores, Cursos, Proyectos y Reportes
- **Exportación de datos** - CSV y JSON
- **Búsqueda y filtrado** - En tiempo real para todas las secciones
- **Notificaciones** - Sistema de notificaciones en tiempo real
- **Atajos de teclado** - Navegación rápida con teclado

## 📁 Estructura del Proyecto

```
frontend/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   └── themes.css          # Estilos de temas
├── js/
│   ├── app.js             # Aplicación principal
│   ├── api.js             # Servicios API
│   ├── utils.js           # Utilidades
│   ├── themes.js          # Gestor de temas
│   ├── navigation.js      # Navegación
│   ├── dashboard.js       # Dashboard
│   ├── estudiantes.js     # Gestión de estudiantes
│   ├── profesores.js      # Gestión de profesores
│   ├── cursos.js          # Gestión de cursos
│   ├── proyectos.js       # Gestión de proyectos
│   └── reportes.js        # Sistema de reportes
└── public/                # Archivos estáticos
    ├── favicon.ico
    ├── logo192.png
    └── ...
```

## 🎨 Temas Disponibles

1. **Claro** - Tema por defecto con colores claros
2. **Oscuro** - Tema oscuro para mejor visualización nocturna
3. **Glassmorfismo** - Efecto de cristal con transparencias
4. **Neumorfismo** - Diseño con efectos de profundidad

## ⚡ Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Actividad reciente
- Contadores animados
- Widgets personalizables

### Gestión de Estudiantes
- Lista completa con búsqueda y filtros
- Formularios de creación y edición
- Exportación de datos
- Gestión de estados

### Gestión de Profesores
- Administración de profesores
- Filtrado por especialidad
- Seguimiento de experiencia

### Gestión de Cursos
- Catálogo de cursos
- Asignación de profesores
- Control de créditos

### Gestión de Proyectos
- Seguimiento de proyectos estudiantiles
- Control de estados
- Asignación a estudiantes

### Sistema de Reportes
- Reportes automáticos
- Exportación CSV/JSON
- Estadísticas detalladas
- Reportes personalizados

## 🎯 Atajos de Teclado

- `Alt + 1-6` - Navegación entre secciones
- `Ctrl + Shift + T` - Cambiar tema
- `F5` - Actualizar datos
- `Esc` - Cerrar modal
- `Ctrl + /` - Mostrar ayuda

## 🔧 Instalación y Uso

1. **Servidor Web**: El frontend requiere un servidor web para funcionar correctamente:

   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

2. **Acceder**: Abrir `http://localhost:8000` en el navegador

3. **Backend**: Asegúrate de que el backend esté ejecutándose en `http://localhost:8080`

## 🌐 APIs Requeridas

El frontend espera que el backend proporcione las siguientes APIs:

```
GET    /api/estudiantes
POST   /api/estudiantes
PUT    /api/estudiantes/{id}
DELETE /api/estudiantes/{id}

GET    /api/profesores
POST   /api/profesores
PUT    /api/profesores/{id}
DELETE /api/profesores/{id}

GET    /api/cursos
POST   /api/cursos
PUT    /api/cursos/{id}
DELETE /api/cursos/{id}

GET    /api/proyectos
POST   /api/proyectos
PUT    /api/proyectos/{id}
DELETE /api/proyectos/{id}

GET    /api/reportes/dashboard
GET    /api/reportes/estudiantes
GET    /api/reportes/profesores
GET    /api/reportes/cursos
```

## 🔍 Modo de Desarrollo

Para desarrollo local, el sistema incluye datos mock que se activan automáticamente cuando se ejecuta en `localhost`. Esto permite probar la funcionalidad sin necesidad de un backend completo.

## 📱 Compatibilidad

- **Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos**: Desktop, Tablet, Móvil
- **Resoluciones**: Desde 320px hasta 4K

## 🛠️ Personalización

### Cambiar Colores del Tema
Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    /* ... más variables */
}
```

### Agregar Nuevas Secciones
1. Crear archivo JS en `js/`
2. Agregar sección HTML en `index.html`
3. Registrar en el sistema de navegación

### Personalizar Temas
Edita `css/themes.css` para modificar o agregar nuevos temas.

## 🚧 Estado del Proyecto

- ✅ Interfaz principal
- ✅ Sistema de navegación
- ✅ Gestión de temas
- ✅ CRUD para todas las entidades
- ✅ Sistema de reportes
- ✅ Exportación de datos
- ✅ Búsqueda y filtros
- ✅ Notificaciones
- ✅ Diseño responsivo

## 📄 Licencia

Uso académico - Universidad Tecnológica del Perú

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
