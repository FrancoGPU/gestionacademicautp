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
