import React, { useState, useEffect } from 'react';
import ProfesorForm from './ProfesorForm';

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
  const [showForm, setShowForm] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const eliminarProfesor = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/profesores/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el profesor');
      }

      // Actualizar la lista después de eliminar
      fetchProfesores();
      alert('Profesor eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el profesor: ' + error.message);
    }
  };

  const editarProfesor = (profesor) => {
    setEditingProfesor(profesor);
    setIsEditing(true);
    setShowForm(true);
  };

  const agregarProfesor = () => {
    setEditingProfesor(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (profesorData) => {
    try {
      if (isEditing) {
        // Actualizar profesor
        const response = await fetch(`http://localhost:8080/api/profesores/${editingProfesor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profesorData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el profesor');
        }
        alert('Profesor actualizado exitosamente');
      } else {
        // Crear nuevo profesor
        const response = await fetch('http://localhost:8080/api/profesores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profesorData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el profesor');
        }
        alert('Profesor creado exitosamente');
      }

      // Cerrar formulario y recargar datos
      setShowForm(false);
      setEditingProfesor(null);
      setIsEditing(false);
      fetchProfesores();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el profesor: ' + error.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProfesor(null);
    setIsEditing(false);
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Cargando profesores...</p>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <h3>Error al cargar los datos</h3>
      <p>{error}</p>
      <button onClick={fetchProfesores} className="btn-primary">
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="profesores-management">
      {/* Estadísticas rápidas */}
      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{profesores.length}</span>
            <span className="stat-label">Profesores Encontrados</span>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{profesores.filter(p => p.activo).length}</span>
            <span className="stat-label">Activos</span>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <span className="stat-value">
              {profesores.reduce((acc, p) => acc + (p.cursosAsignados?.length || 0), 0)}
            </span>
            <span className="stat-label">Cursos Asignados</span>
          </div>
        </div>
      </div>

      {/* Filtros modernos */}
      <div className="filtros-section">
        <div className="filtros-header">
          <h3>
            <span className="filter-icon">🔍</span>
            Filtros de Búsqueda
          </h3>
          <button onClick={limpiarFiltros} className="btn-clear-filters">
            <span>🗑️</span>
            Limpiar
          </button>
        </div>
        <div className="filtros-modern-grid">
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎯</span>
              Especialidad
            </label>
            <input
              type="text"
              placeholder="Buscar por especialidad..."
              value={filtros.especialidad}
              onChange={(e) => handleFiltroChange('especialidad', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎓</span>
              Grado Académico
            </label>
            <input
              type="text"
              placeholder="Buscar por grado..."
              value={filtros.grado}
              onChange={(e) => handleFiltroChange('grado', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">⏰</span>
              Experiencia Mínima
            </label>
            <input
              type="number"
              placeholder="Años..."
              value={filtros.experiencia}
              onChange={(e) => handleFiltroChange('experiencia', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Tabla moderna */}
      <div className="table-section">
        <div className="table-header">
          <h3>
            <span className="table-icon">📋</span>
            Lista de Profesores
          </h3>
          <div className="table-actions">
            <button 
              className="btn-add-professor"
              onClick={agregarProfesor}
            >
              <span>➕</span>
              Agregar Profesor
            </button>
            <span className="results-count">
              {profesores.length} resultado{profesores.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        
        <div className="cards-container">
          {profesores.length > 0 ? (
            profesores.map((profesor) => (
              <div key={profesor.id} className="professor-card-item">
                <div className="card-header">
                  <div className="professor-info">
                    <div className="professor-avatar">
                      {profesor.nombre.charAt(0)}{profesor.apellido.charAt(0)}
                    </div>
                    <div className="professor-details">
                      <h4>{profesor.nombre} {profesor.apellido}</h4>
                      <span className="professor-id">ID: {profesor.id}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => editarProfesor(profesor)}
                      title="Editar profesor"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => eliminarProfesor(profesor.id)}
                      title="Eliminar profesor"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="info-group">
                    <span className="info-label">Email</span>
                    <span className="info-value">{profesor.email}</span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Especialidad</span>
                    <span className="info-value">
                      <span className="badge badge-especialidad">
                        {profesor.especialidad}
                      </span>
                    </span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Grado Académico</span>
                    <span className="info-value">
                      <span className="badge badge-grado">
                        {profesor.gradoAcademico}
                      </span>
                    </span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Experiencia</span>
                    <span className="info-value">{profesor.anosExperiencia} años</span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Estado</span>
                    <span className="info-value">
                      <span className={`badge ${profesor.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                        {profesor.activo ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Cursos Asignados</span>
                    <span className="info-value">
                      {profesor.cursosAsignados && profesor.cursosAsignados.length > 0 ? (
                        <span className="badge badge-cursos">
                          📚 {profesor.cursosAsignados.length} curso{profesor.cursosAsignados.length !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>Sin asignaciones</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results-modern">
              <div className="no-results-icon">🔍</div>
              <h3>No se encontraron profesores</h3>
              <p>No hay profesores que coincidan con los filtros aplicados.</p>
              <button onClick={limpiarFiltros} className="btn-primary">
                <span>🔄</span>
                Ver todos los profesores
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS embebidos modernos */}
      <style jsx>{`
        .profesores-management {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card-modern {
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3498db, #9b59b6, #e74c3c);
        }

        .stat-card-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .stat-icon {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .filtros-section {
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .filtros-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .filtros-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .filter-icon {
          font-size: 1.5rem;
        }

        .btn-clear-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-clear-filters:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .filtros-modern-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.875rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        .filter-input {
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fff;
        }

        .filter-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          transform: translateY(-1px);
        }

        .table-section {
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .table-header {
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .table-icon {
          font-size: 1.5rem;
        }

        .results-count {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .modern-table-container {
          overflow-x: auto;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modern-table th {
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          color: white;
          padding: 1.25rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .th-icon {
          font-size: 1rem;
        }

        .modern-table td {
          padding: 1.25rem;
          border-bottom: 1px solid #f1f2f6;
          vertical-align: middle;
        }

        .table-row:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          transform: scale(1.01);
          transition: all 0.2s ease;
        }

        .professor-info-cell {
          min-width: 220px;
        }

        .professor-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .professor-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
        }

        .professor-details {
          display: flex;
          flex-direction: column;
        }

        .professor-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1rem;
        }

        .professor-id {
          font-size: 0.75rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .contact-info .email {
          color: #3498db;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-especialidad {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          color: #1976d2;
        }

        .badge-grado {
          background: linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%);
          color: #f57c00;
        }

        .badge-estado.activo {
          background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
          color: #2e7d32;
        }

        .badge-estado.inactivo {
          background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
          color: #c62828;
        }

        .badge-cursos {
          background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
          color: #7b1fa2;
        }

        .experience-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .experience-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
        }

        .experience-label {
          font-size: 0.75rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .cursos-info {
          text-align: center;
        }

        .no-cursos {
          color: #95a5a6;
          font-style: italic;
          font-size: 0.875rem;
        }

        .no-results-modern {
          padding: 4rem 2rem;
          text-align: center;
          color: #7f8c8d;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-results-modern h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .no-results-modern p {
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .filtros-modern-grid {
            grid-template-columns: 1fr;
          }
          
          .table-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .modern-table {
            font-size: 0.875rem;
          }
          
          .modern-table th,
          .modern-table td {
            padding: 0.75rem;
          }
          
          .professor-card {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .professor-avatar {
            width: 40px;
            height: 40px;
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Modal para el formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}</h3>
              <button className="modal-close" onClick={handleFormCancel}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <ProfesorForm
                profesor={editingProfesor}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesoresTable;
