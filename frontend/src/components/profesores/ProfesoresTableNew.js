import React, { useState, useEffect } from 'react';

const ProfesoresTable = () => {
  const [profesores, setProfesores] = useState([]);
  const [allProfesores, setAllProfesores] = useState([]);
  const [filtros, setFiltros] = useState({
    especialidad: '',
    grado: '',
    experiencia: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfesores();
  }, []);

  // Aplicar filtros cuando cambien los filtros o los datos
  useEffect(() => {
    const aplicarFiltrosLocal = () => {
      let data = [...allProfesores];
      
      // Aplicar filtros localmente para búsqueda parcial
      if (filtros.especialidad.trim()) {
        data = data.filter(profesor => 
          profesor.especialidad && 
          profesor.especialidad.toLowerCase().includes(filtros.especialidad.toLowerCase().trim())
        );
      }
      
      if (filtros.grado.trim()) {
        data = data.filter(profesor => 
          profesor.gradoAcademico && 
          profesor.gradoAcademico.toLowerCase().includes(filtros.grado.toLowerCase().trim())
        );
      }
      
      if (filtros.experiencia) {
        data = data.filter(profesor => 
          profesor.anosExperiencia >= parseInt(filtros.experiencia)
        );
      }

      setProfesores(data);
    };

    aplicarFiltrosLocal();
  }, [filtros, allProfesores]);

  const fetchProfesores = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/profesores');
      if (!response.ok) throw new Error('Error al cargar profesores');
      const data = await response.json();
      setAllProfesores(data);
      setProfesores(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      especialidad: '',
      grado: '',
      experiencia: ''
    });
  };

  if (loading) return <div className="loading">Cargando profesores...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profesores-container">
      <div className="header-section">
        <h2>Gestión de Profesores</h2>
        <p>Total: {profesores.length} profesores</p>
      </div>

      {/* Sección de filtros */}
      <div className="filtros-container">
        <h3>Filtros de Búsqueda</h3>
        <div className="filtros-grid">
          <div className="filtro-item">
            <label>Especialidad:</label>
            <input
              type="text"
              placeholder="Ej: Redes, Software, Base..."
              value={filtros.especialidad}
              onChange={(e) => handleFiltroChange('especialidad', e.target.value)}
              className="filtro-input"
            />
          </div>
          
          <div className="filtro-item">
            <label>Grado Académico:</label>
            <input
              type="text"
              placeholder="Ej: Maestría, Doctorado..."
              value={filtros.grado}
              onChange={(e) => handleFiltroChange('grado', e.target.value)}
              className="filtro-input"
            />
          </div>
          
          <div className="filtro-item">
            <label>Años de Experiencia (mínimo):</label>
            <input
              type="number"
              placeholder="Ej: 5"
              value={filtros.experiencia}
              onChange={(e) => handleFiltroChange('experiencia', e.target.value)}
              className="filtro-input"
              min="0"
            />
          </div>
          
          <div className="filtro-actions">
            <button onClick={limpiarFiltros} className="btn-secondary">
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de profesores */}
      <div className="table-container">
        <table className="profesores-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Especialidad</th>
              <th>Grado Académico</th>
              <th>Experiencia</th>
              <th>Estado</th>
              <th>Cursos Asignados</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor) => (
              <tr key={profesor.id}>
                <td>{profesor.nombre} {profesor.apellido}</td>
                <td>{profesor.email}</td>
                <td>
                  <span className="especialidad-badge">
                    {profesor.especialidad}
                  </span>
                </td>
                <td>{profesor.gradoAcademico}</td>
                <td>{profesor.anosExperiencia} años</td>
                <td>
                  <span className={`estado-badge ${profesor.activo ? 'activo' : 'inactivo'}`}>
                    {profesor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  {profesor.cursosAsignados && profesor.cursosAsignados.length > 0 ? (
                    <span className="cursos-count">
                      {profesor.cursosAsignados.length} curso(s)
                    </span>
                  ) : (
                    <span className="no-cursos">Sin cursos</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {profesores.length === 0 && (
          <div className="no-results">
            <p>No se encontraron profesores con los criterios de búsqueda.</p>
            <button onClick={limpiarFiltros} className="btn-primary">
              Ver todos los profesores
            </button>
          </div>
        )}
      </div>

      {/* Estilos CSS embebidos */}
      <style jsx>{`
        .profesores-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-section {
          margin-bottom: 30px;
          text-align: center;
        }

        .header-section h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .filtros-container {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .filtros-container h3 {
          margin-bottom: 15px;
          color: #495057;
        }

        .filtros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          align-items: end;
        }

        .filtro-item {
          display: flex;
          flex-direction: column;
        }

        .filtro-item label {
          margin-bottom: 5px;
          font-weight: 500;
          color: #6c757d;
        }

        .filtro-input {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .filtro-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .filtro-actions {
          display: flex;
          align-items: flex-end;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profesores-table {
          width: 100%;
          border-collapse: collapse;
        }

        .profesores-table th,
        .profesores-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .profesores-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .especialidad-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .estado-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .estado-badge.activo {
          background: #d4edda;
          color: #155724;
        }

        .estado-badge.inactivo {
          background: #f8d7da;
          color: #721c24;
        }

        .cursos-count {
          background: #fff3cd;
          color: #856404;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .no-cursos {
          color: #6c757d;
          font-style: italic;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #dc3545;
        }

        @media (max-width: 768px) {
          .filtros-grid {
            grid-template-columns: 1fr;
          }
          
          .profesores-table {
            font-size: 14px;
          }
          
          .profesores-table th,
          .profesores-table td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfesoresTable;
