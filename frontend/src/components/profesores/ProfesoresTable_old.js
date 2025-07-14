import React, { useState, useEffect } from 'react';
import ProfesorForm from './ProfesorForm';

const ProfesoresTable = () => {
  const [profesores, setProfesores] = useState([]);
  const [filtros, setFiltros] = useState({
    especialidad: '',
    grado: '',
    experiencia: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState(null);
  const [allProfesores, setAllProfesores] = useState([]); // Guardamos todos los profesores

  // CRUD Operations
  const handleCreateProfesor = async (profesorData) => {
    try {
      const response = await fetch('http://localhost:8080/api/profesores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profesorData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al crear profesor');
      }

      setShowForm(false);
      fetchProfesores(); // Refresh the list
    } catch (error) {
      throw new Error(`Error al crear profesor: ${error.message}`);
    }
  };

  const handleUpdateProfesor = async (profesorData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/profesores/${editingProfesor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profesorData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al actualizar profesor');
      }

      setEditingProfesor(null);
      setShowForm(false);
      fetchProfesores(); // Refresh the list
    } catch (error) {
      throw new Error(`Error al actualizar profesor: ${error.message}`);
    }
  };

  const handleDeleteProfesor = async (profesorId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este profesor?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/profesores/${profesorId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al eliminar profesor');
      }

      fetchProfesores(); // Refresh the list
    } catch (error) {
      setError(`Error al eliminar profesor: ${error.message}`);
    }
  };

  const handleEditProfesor = (profesor) => {
    setEditingProfesor(profesor);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProfesor(null);
  };

  const handleFormSubmit = async (profesorData) => {
    if (editingProfesor) {
      await handleUpdateProfesor(profesorData);
    } else {
      await handleCreateProfesor(profesorData);
    }
  };

  if (loading) return <div className="loading">Cargando profesores...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Show form if creating or editing
  if (showForm) {
    return (
      <ProfesorForm
        profesor={editingProfesor}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
        isEditing={!!editingProfesor}
      />
    );
  }

  return (
    <div className="profesores-container">
      <div className="header">
        <h2>Gestión de Profesores (Cassandra)</h2>
        <div className="header-actions">
          <p>Total de profesores: {profesores.length}</p>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Nuevo Profesor
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="filtro-grupo">
            <label htmlFor="especialidad">Especialidad:</label>
            <input
              type="text"
              id="especialidad"
              value={filtros.especialidad}
              onChange={(e) => handleFiltroChange('especialidad', e.target.value)}
              placeholder="Ej: Redes, Programación, Base de Datos..."
            />
            <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '2px' }}>
              Escribe para buscar especialidades que contengan el texto
            </small>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="grado">Grado Académico:</label>
            <input
              type="text"
              id="grado"
              value={filtros.grado}
              onChange={(e) => handleFiltroChange('grado', e.target.value)}
              placeholder="Ej: Doctor, Magíster, Licenciado..."
            />
            <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '2px' }}>
              Escribe para buscar grados académicos
            </small>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="experiencia">Años de Experiencia (mínimo):</label>
            <input
              type="number"
              id="experiencia"
              min="0"
              max="50"
              value={filtros.experiencia}
              onChange={(e) => handleFiltroChange('experiencia', e.target.value)}
              placeholder="Ej: 5"
            />
          </div>
        </div>

        <div className="filtros-botones">
          <button 
            onClick={aplicarFiltros}
            className="btn-primary"
          >
            Aplicar Filtros
          </button>
          <button 
            onClick={limpiarFiltros}
            className="btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla de Profesores */}
      <div className="table-container">
        <table className="profesores-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Especialidad</th>
              <th>Grado Académico</th>
              <th>Experiencia</th>
              <th>Cursos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map(profesor => (
              <tr key={profesor.id}>
                <td className="nombre-cell">
                  <strong>{profesor.nombre} {profesor.apellido}</strong>
                </td>
                <td>{profesor.correo}</td>
                <td>
                  <span className="especialidad-badge">
                    {profesor.especialidad}
                  </span>
                </td>
                <td>
                  <span className={`grado-badge grado-${profesor.gradoAcademico?.toLowerCase()}`}>
                    {profesor.gradoAcademico}
                  </span>
                </td>
                <td>
                  <span className="experiencia-badge">
                    {profesor.anosExperiencia} años
                  </span>
                </td>
                <td>
                  <span className="cursos-count">
                    {profesor.cursoIds ? profesor.cursoIds.length : 0} cursos
                  </span>
                </td>
                <td>
                  <span className={`estado-badge ${profesor.activo ? 'activo' : 'inactivo'}`}>
                    {profesor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="acciones-cell">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditProfesor(profesor)}
                    title="Editar profesor"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProfesor(profesor.id)}
                    title="Eliminar profesor"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {profesores.length === 0 && !loading && (
          <div className="no-data">
            <p>No se encontraron profesores con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfesoresTable;
