// Sistema de Reportes - Implementación Nueva y Simplificada
class SimpleReportesManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Inicializando sistema de reportes simplificado...');
        
        // Escuchar cuando se cargue la sección de reportes
        window.addEventListener('sectionChanged', (e) => {
            if (e.detail.section === 'reportes') {
                this.loadReportesSection();
            }
        });
    }

    loadReportesSection() {
        console.log('Cargando sección de reportes...');
    }

    // Crear archivo CSV manualmente sin dependencias complejas
    createCSVContent(data) {
        if (!data || data.length === 0) {
            return 'No hay datos disponibles';
        }

        // Obtener headers del primer objeto
        const headers = Object.keys(data[0]);
        
        // Crear contenido CSV
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header] || '';
                // Convertir a string y limpiar
                value = String(value).replace(/"/g, '""');
                // Si contiene comas, envolver en comillas
                if (value.includes(',') || value.includes('\n')) {
                    value = `"${value}"`;
                }
                return value;
            });
            csvContent += values.join(',') + '\n';
        });

        return csvContent;
    }

    // Descargar archivo CSV directamente
    downloadCSV(content, filename) {
        try {
            // Crear blob con BOM para UTF-8
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + content], { 
                type: 'text/csv;charset=utf-8;' 
            });

            // Crear URL temporal
            const url = window.URL.createObjectURL(blob);
            
            // Crear elemento de descarga
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            
            // Agregar al DOM, hacer clic y remover
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Limpiar URL temporal
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            console.log(`Archivo ${filename} descargado exitosamente`);
            return true;
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            return false;
        }
    }

    // Formatear fecha simple
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    // Generar reporte de estudiantes
    async generateEstudiantesReport() {
        try {
            console.log('Generando reporte de estudiantes...');
            
            // Mostrar indicador de carga
            if (typeof Utils !== 'undefined') {
                Utils.showLoading();
                Utils.showNotification('Generando reporte de estudiantes...', 'info');
            }

            // Obtener datos
            const response = await fetch('http://localhost:8080/api/estudiantes');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const estudiantes = await response.json();

            // Obtener cursos y proyectos para referencias
            const [cursosRes, proyectosRes] = await Promise.all([
                fetch('http://localhost:8080/api/cursos'),
                fetch('http://localhost:8080/api/proyectos')
            ]);

            const cursos = cursosRes.ok ? await cursosRes.json() : [];
            const proyectos = proyectosRes.ok ? await proyectosRes.json() : [];

            console.log('Datos obtenidos:', { 
                estudiantes: estudiantes.length, 
                cursos: cursos.length, 
                proyectos: proyectos.length 
            });

            // Procesar datos
            const reportData = [];

            // Agregar estadísticas generales
            const totalEstudiantes = estudiantes.length;
            const estudiantesConCursos = estudiantes.filter(e => e.cursoIds && e.cursoIds.length > 0).length;
            const estudiantesConProyectos = estudiantes.filter(e => e.proyectoIds && e.proyectoIds.length > 0).length;

            reportData.push({ 
                Seccion: 'ESTADISTICAS GENERALES',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Total de Estudiantes',
                Dato: totalEstudiantes,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Estudiantes con Cursos',
                Dato: estudiantesConCursos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Estudiantes con Proyectos',
                Dato: estudiantesConProyectos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Fecha de Generacion',
                Dato: new Date().toLocaleString('es-ES'),
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: '',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'DATOS DETALLADOS',
                Dato: '',
                Valor: '',
                Detalle: ''
            });

            // Agregar datos de estudiantes
            estudiantes.forEach(estudiante => {
                // Obtener nombres de cursos
                let cursosNombres = 'Ninguno';
                if (estudiante.cursoIds && estudiante.cursoIds.length > 0) {
                    const nombresCursos = estudiante.cursoIds.map(id => {
                        const curso = cursos.find(c => c.id === id);
                        return curso ? `${curso.codigo}-${curso.nombre}` : `Curso${id}`;
                    });
                    cursosNombres = nombresCursos.join('; ');
                }

                // Obtener nombres de proyectos
                let proyectosNombres = 'Ninguno';
                if (estudiante.proyectoIds && estudiante.proyectoIds.length > 0) {
                    const nombresProyectos = estudiante.proyectoIds.map(id => {
                        const proyecto = proyectos.find(p => p.id === id);
                        return proyecto ? proyecto.titulo : `Proyecto${id}`;
                    });
                    proyectosNombres = nombresProyectos.join('; ');
                }

                reportData.push({
                    Seccion: 'ESTUDIANTE',
                    Dato: `ID: ${estudiante.id}`,
                    Valor: `${estudiante.nombre} ${estudiante.apellido || ''}`,
                    Detalle: `${estudiante.correo} | Nacimiento: ${this.formatDate(estudiante.fecha_nacimiento)} | Cursos: ${cursosNombres} | Proyectos: ${proyectosNombres}`
                });
            });

            // Crear CSV
            const csvContent = this.createCSVContent(reportData);
            console.log('CSV generado, longitud:', csvContent.length);

            // Descargar archivo
            const filename = `reporte_estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
            const success = this.downloadCSV(csvContent, filename);

            if (success) {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Reporte de estudiantes generado correctamente', 'success');
                }
                console.log('Reporte generado exitosamente');
            } else {
                throw new Error('Error al descargar el archivo');
            }

        } catch (error) {
            console.error('Error generando reporte de estudiantes:', error);
            if (typeof Utils !== 'undefined') {
                Utils.showNotification('Error al generar el reporte de estudiantes', 'error');
            }
        } finally {
            if (typeof Utils !== 'undefined') {
                Utils.hideLoading();
            }
        }
    }

    // Generar reporte de profesores
    async generateProfesoresReport() {
        try {
            console.log('Generando reporte de profesores...');
            
            if (typeof Utils !== 'undefined') {
                Utils.showLoading();
                Utils.showNotification('Generando reporte de profesores...', 'info');
            }

            // Obtener datos
            const response = await fetch('http://localhost:8080/api/profesores');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const profesores = await response.json();

            // Obtener cursos para referencias
            const cursosRes = await fetch('http://localhost:8080/api/cursos');
            const cursos = cursosRes.ok ? await cursosRes.json() : [];

            console.log('Datos obtenidos:', { 
                profesores: profesores.length, 
                cursos: cursos.length 
            });

            // Procesar datos
            const reportData = [];

            // Estadísticas
            const totalProfesores = profesores.length;
            const profesoresActivos = profesores.filter(p => p.activo).length;
            const profesoresConCursos = profesores.filter(p => p.cursoIds && p.cursoIds.length > 0).length;

            reportData.push({ 
                Seccion: 'ESTADISTICAS GENERALES',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Total de Profesores',
                Dato: totalProfesores,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Profesores Activos',
                Dato: profesoresActivos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Profesores con Cursos',
                Dato: profesoresConCursos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Fecha de Generacion',
                Dato: new Date().toLocaleString('es-ES'),
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: '',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'DATOS DETALLADOS',
                Dato: '',
                Valor: '',
                Detalle: ''
            });

            // Agregar datos de profesores
            profesores.forEach(profesor => {
                // Obtener nombres de cursos asignados
                let cursosNombres = 'Ninguno';
                if (profesor.cursoIds && profesor.cursoIds.length > 0) {
                    const nombresCursos = profesor.cursoIds.map(id => {
                        const curso = cursos.find(c => c.id === id);
                        return curso ? `${curso.codigo}-${curso.nombre}` : `Curso${id}`;
                    });
                    cursosNombres = nombresCursos.join('; ');
                }

                reportData.push({
                    Seccion: 'PROFESOR',
                    Dato: `ID: ${profesor.id}`,
                    Valor: `${profesor.nombre} ${profesor.apellido || ''}`,
                    Detalle: `${profesor.correo} | ${profesor.especialidad} | ${profesor.gradoAcademico} | Experiencia: ${profesor.anosExperiencia}años | Estado: ${profesor.activo ? 'Activo' : 'Inactivo'} | Cursos: ${cursosNombres}`
                });
            });

            // Crear CSV y descargar
            const csvContent = this.createCSVContent(reportData);
            const filename = `reporte_profesores_${new Date().toISOString().split('T')[0]}.csv`;
            const success = this.downloadCSV(csvContent, filename);

            if (success) {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Reporte de profesores generado correctamente', 'success');
                }
                console.log('Reporte de profesores generado exitosamente');
            } else {
                throw new Error('Error al descargar el archivo');
            }

        } catch (error) {
            console.error('Error generando reporte de profesores:', error);
            if (typeof Utils !== 'undefined') {
                Utils.showNotification('Error al generar el reporte de profesores', 'error');
            }
        } finally {
            if (typeof Utils !== 'undefined') {
                Utils.hideLoading();
            }
        }
    }

    // Generar reporte de cursos
    async generateCursosReport() {
        try {
            console.log('Generando reporte de cursos...');
            
            if (typeof Utils !== 'undefined') {
                Utils.showLoading();
                Utils.showNotification('Generando reporte de cursos...', 'info');
            }

            // Obtener datos
            const [cursosRes, estudiantesRes, profesoresRes] = await Promise.all([
                fetch('http://localhost:8080/api/cursos'),
                fetch('http://localhost:8080/api/estudiantes'),
                fetch('http://localhost:8080/api/profesores')
            ]);

            const cursos = cursosRes.ok ? await cursosRes.json() : [];
            const estudiantes = estudiantesRes.ok ? await estudiantesRes.json() : [];
            const profesores = profesoresRes.ok ? await profesoresRes.json() : [];

            console.log('Datos obtenidos:', { 
                cursos: cursos.length, 
                estudiantes: estudiantes.length,
                profesores: profesores.length 
            });

            // Procesar datos
            const reportData = [];

            // Estadísticas
            const totalCursos = cursos.length;
            const totalCreditos = cursos.reduce((sum, c) => sum + (c.creditos || 0), 0);
            const promedioCreditos = totalCursos > 0 ? (totalCreditos / totalCursos).toFixed(1) : 0;

            reportData.push({ 
                Seccion: 'ESTADISTICAS GENERALES',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Total de Cursos',
                Dato: totalCursos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Total de Creditos',
                Dato: totalCreditos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Promedio de Creditos',
                Dato: promedioCreditos,
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'Fecha de Generacion',
                Dato: new Date().toLocaleString('es-ES'),
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: '',
                Dato: '',
                Valor: '',
                Detalle: ''
            });
            reportData.push({ 
                Seccion: 'DATOS DETALLADOS',
                Dato: '',
                Valor: '',
                Detalle: ''
            });

            // Agregar datos de cursos
            cursos.forEach(curso => {
                // Contar estudiantes inscritos
                const estudiantesInscritos = estudiantes.filter(e => 
                    e.cursoIds && e.cursoIds.includes(curso.id)
                ).length;

                // Encontrar profesor asignado
                const profesor = profesores.find(p => 
                    p.cursoIds && p.cursoIds.includes(curso.id)
                );
                const nombreProfesor = profesor ? 
                    `${profesor.nombre} ${profesor.apellido || ''}` : 
                    'Sin asignar';

                reportData.push({
                    Seccion: 'CURSO',
                    Dato: `${curso.codigo} - ${curso.nombre}`,
                    Valor: `${curso.creditos} creditos`,
                    Detalle: `Profesor: ${nombreProfesor} | Estudiantes inscritos: ${estudiantesInscritos}`
                });
            });

            // Crear CSV y descargar
            const csvContent = this.createCSVContent(reportData);
            const filename = `reporte_cursos_${new Date().toISOString().split('T')[0]}.csv`;
            const success = this.downloadCSV(csvContent, filename);

            if (success) {
                if (typeof Utils !== 'undefined') {
                    Utils.showNotification('Reporte de cursos generado correctamente', 'success');
                }
                console.log('Reporte de cursos generado exitosamente');
            } else {
                throw new Error('Error al descargar el archivo');
            }

        } catch (error) {
            console.error('Error generando reporte de cursos:', error);
            if (typeof Utils !== 'undefined') {
                Utils.showNotification('Error al generar el reporte de cursos', 'error');
            }
        } finally {
            if (typeof Utils !== 'undefined') {
                Utils.hideLoading();
            }
        }
    }
}

// Crear instancia global
const simpleReportes = new SimpleReportesManager();

// Sobrescribir las funciones globales existentes
window.generateEstudiantesReport = () => simpleReportes.generateEstudiantesReport();
window.generateProfesoresReport = () => simpleReportes.generateProfesoresReport();
window.generateCursosReport = () => simpleReportes.generateCursosReport();

// Exportar para uso global
window.SimpleReportes = simpleReportes;

console.log('Sistema de reportes simplificado cargado correctamente');
