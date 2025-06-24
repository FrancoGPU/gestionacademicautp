// Script de inicialización para MongoDB
// Basado en el modelo Java: pe.edu.utp.gestionacademicautp.model.mongo.ProyectoInvestigacion
// Proyectos de investigación con datos UTF-8

// Cambiar a la base de datos correspondiente
use('utp_gestion_academica_db_mongo');

// Crear colección proyectos_investigacion si no existe e insertar datos de prueba
db.proyectos_investigacion.insertMany([
    {
        titulo: "Sistema de Gestión Académica UTP",
        resumen: "Desarrollo de una plataforma integral para la administración de estudiantes, cursos y proyectos académicos con tecnologías modernas como Spring Boot y React.",
        fechaInicio: "2024-03-01",
        fechaFin: "2024-12-15"
    },
    {
        titulo: "Plataforma de E-learning Inteligente",
        resumen: "Implementación de un sistema de aprendizaje virtual con inteligencia artificial para personalizar la experiencia educativa y mejorar el rendimiento estudiantil.",
        fechaInicio: "2024-04-15",
        fechaFin: "2024-11-30"
    },
    {
        titulo: "App Móvil para Biblioteca Virtual",
        resumen: "Aplicación móvil multiplataforma que permite a los estudiantes acceder al catálogo de libros digitales, reservar recursos y gestionar préstamos bibliográficos.",
        fechaInicio: "2024-05-10",
        fechaFin: "2024-10-20"
    },
    {
        titulo: "Sistema de Monitoreo IoT para Campus",
        resumen: "Red de sensores inteligentes para monitorear temperatura, humedad, ocupación de aulas y consumo energético en tiempo real para optimizar recursos del campus.",
        fechaInicio: "2024-06-01",
        fechaFin: "2025-01-15"
    },
    {
        titulo: "Chatbot Inteligente para Soporte Estudiantil",
        resumen: "Asistente virtual basado en procesamiento de lenguaje natural para resolver consultas frecuentes de estudiantes sobre trámites, horarios y procedimientos académicos.",
        fechaInicio: "2024-07-05",
        fechaFin: "2024-12-10"
    },
    {
        titulo: "Análisis Predictivo del Rendimiento Académico",
        resumen: "Sistema de machine learning para identificar patrones en el rendimiento estudiantil y predecir posibles casos de deserción académica para intervención temprana.",
        fechaInicio: "2024-08-01",
        fechaFin: "2025-02-28"
    }
]);

// Verificar datos insertados
print("MongoDB: Colección proyectos_investigacion inicializada correctamente");
print("Total de proyectos: " + db.proyectos_investigacion.countDocuments());
print("Proyectos sample:");
db.proyectos_investigacion.find().limit(3).forEach(printjson);
