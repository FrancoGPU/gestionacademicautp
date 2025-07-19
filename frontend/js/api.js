// Configuración de la API
const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Clase principal para manejar las llamadas a la API
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.defaultHeaders = API_CONFIG.headers;
    }

    // Método genérico para hacer requests
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders },
            ...options
        };

        // El nuevo sistema de autenticación usa cookies de sesión
        // por lo que no necesitamos manejar tokens manualmente

        try {
            Utils.showLoading();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Manejar respuestas vacías (común en operaciones DELETE)
            const contentType = response.headers.get('content-type');
            let data;
            
            if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
                // Respuesta vacía o no JSON - típico en DELETE operations
                data = { success: true, message: 'Operación completada exitosamente' };
            } else {
                const text = await response.text();
                if (text.trim() === '') {
                    data = { success: true, message: 'Operación completada exitosamente' };
                } else {
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        // Si no es JSON válido, devolver el texto como mensaje
                        data = { success: true, message: text };
                    }
                }
            }
            
            Utils.hideLoading();
            return data;

        } catch (error) {
            Utils.hideLoading();
            console.error('API Error:', error);

            if (error.name === 'AbortError') {
                throw new Error('La solicitud tardó demasiado tiempo');
            } else if (error.message.includes('500')) {
                throw new Error('Error interno del servidor');
            } else if (error.message.includes('404')) {
                throw new Error('Recurso no encontrado');
            } else if (error.message.includes('401')) {
                throw new Error('No autorizado');
            } else if (error.message.includes('403')) {
                throw new Error('Acceso denegado');
            }

            throw error;
        }
    }

    // Métodos HTTP básicos
    async get(endpoint) {
        return this.makeRequest(endpoint);
    }

    async post(endpoint, data) {
        return this.makeRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.makeRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async patch(endpoint, data) {
        return this.makeRequest(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.makeRequest(endpoint, {
            method: 'DELETE'
        });
    }

    // Subir archivos
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);

        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const config = {
            method: 'POST',
            headers: {},
            body: formData
        };

        // No establecer Content-Type para FormData
        delete config.headers['Content-Type'];

        return this.makeRequest(endpoint, config);
    }
}

// Servicios específicos para cada entidad
class EstudiantesService extends ApiService {
    async getAll() {
        return this.get('/estudiantes');
    }

    async getById(id) {
        return this.get(`/estudiantes/${id}`);
    }

    async create(estudiante) {
        return this.post('/estudiantes', estudiante);
    }

    async update(id, estudiante) {
        return this.put(`/estudiantes/${id}`, estudiante);
    }

    async delete(id) {
        return super.delete(`/estudiantes/${id}`);
    }

    async search(query) {
        return this.get(`/estudiantes/search?q=${encodeURIComponent(query)}`);
    }

    async getByCarrera(carrera) {
        return this.get(`/estudiantes/carrera/${encodeURIComponent(carrera)}`);
    }

    async getEstadisticas() {
        return this.get('/estudiantes/estadisticas');
    }
}

class ProfesoresService extends ApiService {
    async getAll() {
        return this.get('/profesores');
    }

    async getById(id) {
        return this.get(`/profesores/${id}`);
    }

    async create(profesor) {
        return this.post('/profesores', profesor);
    }

    async update(id, profesor) {
        return this.put(`/profesores/${id}`, profesor);
    }

    async delete(id) {
        return super.delete(`/profesores/${id}`);
    }

    async search(query) {
        return this.get(`/profesores/search?q=${encodeURIComponent(query)}`);
    }

    async getByEspecialidad(especialidad) {
        return this.get(`/profesores/especialidad/${encodeURIComponent(especialidad)}`);
    }

    async getCursos(profesorId) {
        return this.get(`/profesores/${profesorId}/cursos`);
    }

    async getEstadisticas() {
        return this.get('/profesores/estadisticas');
    }
}

class CursosService extends ApiService {
    async getAll() {
        return this.get('/cursos');
    }

    async getById(id) {
        return this.get(`/cursos/${id}`);
    }

    async create(curso) {
        return this.post('/cursos', curso);
    }

    async update(id, curso) {
        return this.put(`/cursos/${id}`, curso);
    }

    async delete(id) {
        return super.delete(`/cursos/${id}`);
    }

    async search(query) {
        return this.get(`/cursos/search?q=${encodeURIComponent(query)}`);
    }

    async getEstudiantes(cursoId) {
        return this.get(`/cursos/${cursoId}/estudiantes`);
    }

    async inscribirEstudiante(cursoId, estudianteId) {
        return this.post(`/cursos/${cursoId}/estudiantes`, { estudianteId });
    }

    async desinscribirEstudiante(cursoId, estudianteId) {
        return this.delete(`/cursos/${cursoId}/estudiantes/${estudianteId}`);
    }

    async getEstadisticas() {
        return this.get('/cursos/estadisticas');
    }
}

class ProyectosService extends ApiService {
    async getAll() {
        return this.get('/proyectos');
    }

    async getById(id) {
        return this.get(`/proyectos/${id}`);
    }

    async create(proyecto) {
        return this.post('/proyectos', proyecto);
    }

    async update(id, proyecto) {
        return this.put(`/proyectos/${id}`, proyecto);
    }

    async delete(id) {
        return super.delete(`/proyectos/${id}`);
    }

    async search(query) {
        return this.get(`/proyectos/search?q=${encodeURIComponent(query)}`);
    }

    async getByEstudiante(estudianteId) {
        return this.get(`/proyectos/estudiante/${estudianteId}`);
    }

    async getByEstado(estado) {
        return this.get(`/proyectos/estado/${encodeURIComponent(estado)}`);
    }

    async cambiarEstado(proyectoId, nuevoEstado) {
        return this.patch(`/proyectos/${proyectoId}/estado`, { estado: nuevoEstado });
    }

    async getEstadisticas() {
        return this.get('/proyectos/estadisticas');
    }
}

class ReportesService extends ApiService {
    async getEstudiantesReport(filtros = {}) {
        const params = new URLSearchParams(filtros).toString();
        return this.get(`/reportes/estudiantes?${params}`);
    }

    async getProfesoresReport(filtros = {}) {
        const params = new URLSearchParams(filtros).toString();
        return this.get(`/reportes/profesores?${params}`);
    }

    async getCursosReport(filtros = {}) {
        const params = new URLSearchParams(filtros).toString();
        return this.get(`/reportes/cursos?${params}`);
    }

    async getProyectosReport(filtros = {}) {
        const params = new URLSearchParams(filtros).toString();
        return this.get(`/reportes/proyectos?${params}`);
    }

    async getDashboardStats() {
        return this.get('/reportes/dashboard');
    }

    async exportReport(tipo, formato = 'csv', filtros = {}) {
        const params = new URLSearchParams({ ...filtros, formato }).toString();
        const response = await fetch(`${this.baseURL}/reportes/export/${tipo}?${params}`, {
            headers: this.defaultHeaders
        });

        if (!response.ok) {
            throw new Error('Error al exportar el reporte');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// Crear instancias de los servicios
const estudiantesService = new EstudiantesService();
const profesoresService = new ProfesoresService();
const cursosService = new CursosService();
const proyectosService = new ProyectosService();
const reportesService = new ReportesService();

// Exportar servicios globalmente
window.API = {
    estudiantes: estudiantesService,
    profesores: profesoresService,
    cursos: cursosService,
    proyectos: proyectosService,
    reportes: reportesService
};

// Mock data para desarrollo (eliminar en producción)
const MOCK_DATA = {
    estudiantes: [
        { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@utp.edu.pe', carrera: 'Ingeniería de Sistemas', fecha_nacimiento: '2000-05-15', activo: true },
        { id: 2, nombre: 'María', apellido: 'García', correo: 'maria.garcia@utp.edu.pe', carrera: 'Ingeniería Industrial', fecha_nacimiento: '1999-08-22', activo: true },
        { id: 3, nombre: 'Carlos', apellido: 'López', correo: 'carlos.lopez@utp.edu.pe', carrera: 'Ingeniería Civil', fecha_nacimiento: '2001-03-10', activo: false }
    ],
    profesores: [
        { id: '1', nombre: 'Ana', apellido: 'Rodríguez', correo: 'ana.rodriguez@utp.edu.pe', especialidad: 'Programación', activo: true, gradoAcademico: 'Doctor', anosExperiencia: 10 },
        { id: '2', nombre: 'Luis', apellido: 'Martínez', correo: 'luis.martinez@utp.edu.pe', especialidad: 'Base de Datos', activo: true, gradoAcademico: 'Magister', anosExperiencia: 8 },
        { id: '3', nombre: 'Carmen', apellido: 'Vega', correo: 'carmen.vega@utp.edu.pe', especialidad: 'Redes', activo: true, gradoAcademico: 'Doctor', anosExperiencia: 12 }
    ],
    cursos: [
        { id: 1, nombre: 'Programación I', codigo: 'PROG101', creditos: 4, profesor: 'Dr. Ana Rodríguez', activo: true, semestre: '2024-I' },
        { id: 2, nombre: 'Base de Datos', codigo: 'BD201', creditos: 3, profesor: 'Mg. Luis Martínez', activo: true, semestre: '2024-I' },
        { id: 3, nombre: 'Redes de Computadoras', codigo: 'RED301', creditos: 4, profesor: 'Dr. Carmen Vega', activo: true, semestre: '2024-I' }
    ],
    proyectos: [
        { id: 1, titulo: 'Sistema de Gestión', descripcion: 'Sistema web para gestión académica', estudiante: 'Juan Pérez', estado: 'En Desarrollo', fecha: '2024-01-15' },
        { id: 2, titulo: 'App Mobile', descripcion: 'Aplicación móvil para estudiantes', estudiante: 'María García', estado: 'Completado', fecha: '2024-02-20' },
        { id: 3, titulo: 'Portal Web', descripcion: 'Portal web institucional', estudiante: 'Carlos López', estado: 'Pendiente', fecha: '2024-03-10' }
    ]
};

// Función para usar datos mock en desarrollo
window.useMockData = function () {
    // Override de los servicios para usar datos mock
    estudiantesService.getAll = () => Promise.resolve(MOCK_DATA.estudiantes);
    estudiantesService.getById = (id) => Promise.resolve(MOCK_DATA.estudiantes.find(e => e.id == id));
    estudiantesService.create = (data) => {
        const newId = Math.max(...MOCK_DATA.estudiantes.map(e => e.id)) + 1;
        const newItem = { ...data, id: newId };
        MOCK_DATA.estudiantes.push(newItem);
        return Promise.resolve(newItem);
    };
    estudiantesService.update = (id, data) => {
        const index = MOCK_DATA.estudiantes.findIndex(e => e.id == id);
        if (index >= 0) {
            MOCK_DATA.estudiantes[index] = { ...MOCK_DATA.estudiantes[index], ...data };
            return Promise.resolve(MOCK_DATA.estudiantes[index]);
        }
        return Promise.reject(new Error('Estudiante no encontrado'));
    };
    estudiantesService.delete = (id) => {
        const index = MOCK_DATA.estudiantes.findIndex(e => e.id == id);
        if (index >= 0) {
            MOCK_DATA.estudiantes.splice(index, 1);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Estudiante no encontrado'));
    };

    profesoresService.getAll = () => Promise.resolve(MOCK_DATA.profesores);
    profesoresService.getById = (id) => Promise.resolve(MOCK_DATA.profesores.find(p => p.id == id));
    profesoresService.create = (data) => {
        const newId = (Math.max(...MOCK_DATA.profesores.map(p => parseInt(p.id))) + 1).toString();
        const newItem = { ...data, id: newId };
        MOCK_DATA.profesores.push(newItem);
        return Promise.resolve(newItem);
    };
    profesoresService.update = (id, data) => {
        const index = MOCK_DATA.profesores.findIndex(p => p.id == id);
        if (index >= 0) {
            MOCK_DATA.profesores[index] = { ...MOCK_DATA.profesores[index], ...data };
            return Promise.resolve(MOCK_DATA.profesores[index]);
        }
        return Promise.reject(new Error('Profesor no encontrado'));
    };
    profesoresService.delete = (id) => {
        const index = MOCK_DATA.profesores.findIndex(p => p.id == id);
        if (index >= 0) {
            MOCK_DATA.profesores.splice(index, 1);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Profesor no encontrado'));
    };

    cursosService.getAll = () => Promise.resolve(MOCK_DATA.cursos);
    cursosService.getById = (id) => Promise.resolve(MOCK_DATA.cursos.find(c => c.id == id));
    cursosService.create = (data) => {
        const newId = Math.max(...MOCK_DATA.cursos.map(c => c.id)) + 1;
        const newItem = { ...data, id: newId };
        MOCK_DATA.cursos.push(newItem);
        return Promise.resolve(newItem);
    };
    cursosService.update = (id, data) => {
        const index = MOCK_DATA.cursos.findIndex(c => c.id == id);
        if (index >= 0) {
            MOCK_DATA.cursos[index] = { ...MOCK_DATA.cursos[index], ...data };
            return Promise.resolve(MOCK_DATA.cursos[index]);
        }
        return Promise.reject(new Error('Curso no encontrado'));
    };
    cursosService.delete = (id) => {
        const index = MOCK_DATA.cursos.findIndex(c => c.id == id);
        if (index >= 0) {
            MOCK_DATA.cursos.splice(index, 1);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Curso no encontrado'));
    };

    proyectosService.getAll = () => Promise.resolve(MOCK_DATA.proyectos);
    proyectosService.getById = (id) => Promise.resolve(MOCK_DATA.proyectos.find(p => p.id == id));
    proyectosService.create = (data) => {
        const newId = Math.max(...MOCK_DATA.proyectos.map(p => p.id)) + 1;
        const newItem = { ...data, id: newId };
        MOCK_DATA.proyectos.push(newItem);
        return Promise.resolve(newItem);
    };
    proyectosService.update = (id, data) => {
        const index = MOCK_DATA.proyectos.findIndex(p => p.id == id);
        if (index >= 0) {
            MOCK_DATA.proyectos[index] = { ...MOCK_DATA.proyectos[index], ...data };
            return Promise.resolve(MOCK_DATA.proyectos[index]);
        }
        return Promise.reject(new Error('Proyecto no encontrado'));
    };
    proyectosService.delete = (id) => {
        const index = MOCK_DATA.proyectos.findIndex(p => p.id == id);
        if (index >= 0) {
            MOCK_DATA.proyectos.splice(index, 1);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Proyecto no encontrado'));
    };

    reportesService.getDashboardStats = () => Promise.resolve({
        totalEstudiantes: MOCK_DATA.estudiantes.length,
        totalProfesores: MOCK_DATA.profesores.length,
        totalCursos: MOCK_DATA.cursos.length,
        totalProyectos: MOCK_DATA.proyectos.length
    });
};

// Activar datos mock en desarrollo (DESHABILITADO - Backend funcionando)
// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//     console.log('Activando datos mock para desarrollo...');
//     window.useMockData();
// }
