import React, { useState, useEffect } from 'react';

const ProfesorForm = ({ profesor, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    especialidad: '',
    gradoAcademico: '',
    anosExperiencia: 0,
    cursoIds: [],
    activo: true
  });
  
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const especialidades = [
    'Programación', 'Base de Datos', 'Redes', 'Inteligencia Artificial',
    'Desarrollo Web', 'Estructuras de Datos', 'Matemáticas', 'Física',
    'Química', 'Estadística'
  ];

  const grados = ['Licenciado', 'Magíster', 'Doctor'];

  useEffect(() => {
    fetchCursos();
    if (profesor && isEditing) {
      setFormData({
        nombre: profesor.nombre || '',
        apellido: profesor.apellido || '',
        correo: profesor.correo || '',
        especialidad: profesor.especialidad || '',
        gradoAcademico: profesor.gradoAcademico || '',
        anosExperiencia: profesor.anosExperiencia || 0,
        cursoIds: profesor.cursoIds || [],
        activo: profesor.activo !== undefined ? profesor.activo : true
      });
    }
  }, [profesor, isEditing]);

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cursos');
      if (!response.ok) throw new Error('Error al cargar cursos');
      const data = await response.json();
      setCursos(data);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               name === 'anosExperiencia' ? parseInt(value) || 0 : value
    }));
  };

  const handleCursoToggle = (cursoId) => {
    setFormData(prev => ({
      ...prev,
      cursoIds: prev.cursoIds.includes(cursoId)
        ? prev.cursoIds.filter(id => id !== cursoId)
        : [...prev.cursoIds, cursoId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.nombre.trim() || !formData.apellido.trim()) {
        throw new Error('Nombre y apellido son obligatorios');
      }
      if (!formData.correo.trim() || !formData.correo.includes('@')) {
        throw new Error('Correo electrónico válido es obligatorio');
      }
      if (!formData.especialidad) {
        throw new Error('Especialidad es obligatoria');
      }
      if (!formData.gradoAcademico) {
        throw new Error('Grado académico es obligatorio');
      }
      if (formData.anosExperiencia < 0 || formData.anosExperiencia > 50) {
        throw new Error('Años de experiencia debe estar entre 0 y 50');
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profesor-form-container">
      <form onSubmit={handleSubmit} className="profesor-form">
        <h3>{isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}</h3>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingrese el apellido"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico *</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@utp.edu.pe"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="especialidad">Especialidad *</label>
            <select
              id="especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una especialidad</option>
              {especialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gradoAcademico">Grado Académico *</label>
            <select
              id="gradoAcademico"
              name="gradoAcademico"
              value={formData.gradoAcademico}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un grado</option>
              {grados.map(grado => (
                <option key={grado} value={grado}>{grado}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="anosExperiencia">Años de Experiencia</label>
            <input
              type="number"
              id="anosExperiencia"
              name="anosExperiencia"
              value={formData.anosExperiencia}
              onChange={handleChange}
              min="0"
              max="50"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
              />
              Profesor Activo
            </label>
          </div>
        </div>

        {/* Asignación de Cursos */}
        <div className="form-group">
          <label>Cursos Asignados</label>
          <div className="cursos-assignment">
            {cursos.length > 0 ? (
              <div className="cursos-grid">
                {cursos.map(curso => (
                  <div key={curso.id} className="curso-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.cursoIds.includes(curso.id)}
                        onChange={() => handleCursoToggle(curso.id)}
                      />
                      <span className="curso-info">
                        <strong>{curso.codigo}</strong> - {curso.nombre}
                        <small>({curso.creditos} créditos)</small>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay cursos disponibles</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Profesor
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfesorForm;
