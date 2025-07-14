// Servicio para obtener información de profesores
export const profesorService = {
  // Obtener todos los profesores
  getAllProfesores: async () => {
    const response = await fetch('http://localhost:8080/api/profesores');
    if (!response.ok) throw new Error('Error al cargar profesores');
    return response.json();
  },

  // Obtener profesores por IDs de cursos
  getProfesoresByCursos: async (cursoIds) => {
    try {
      const profesores = await profesorService.getAllProfesores();
      return profesores.filter(profesor => 
        profesor.cursoIds && 
        profesor.activo &&
        cursoIds.some(cursoId => profesor.cursoIds.includes(cursoId))
      );
    } catch (error) {
      console.error('Error al obtener profesores por cursos:', error);
      return [];
    }
  },

  // Obtener profesores por un curso específico
  getProfesoresByCurso: async (cursoId) => {
    try {
      const profesores = await profesorService.getAllProfesores();
      return profesores.filter(profesor => 
        profesor.cursoIds && 
        profesor.activo &&
        profesor.cursoIds.includes(cursoId)
      );
    } catch (error) {
      console.error('Error al obtener profesores por curso:', error);
      return [];
    }
  }
};

export default profesorService;
