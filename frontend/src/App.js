import React, { useState } from 'react';
import { ReporteEstudiante } from './components/reportes';
import { EstudiantesTable, EstudianteForm } from './components/estudiantes';
import { CursosTable, CursoForm, CursoDetalle } from './components/cursos';
import { ProyectosTable, ProyectoForm, ProyectoDetalle } from './components/proyectos';
import { ProfesoresTable } from './components/profesores';
import './styles/App.css';

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [editingEst, setEditingEst] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Cursos
  const [showCursos, setShowCursos] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [showCursoForm, setShowCursoForm] = useState(false);
  const [refreshCursos, setRefreshCursos] = useState(false);
  const [selectedCursoId, setSelectedCursoId] = useState(null);

  // Proyectos
  const [showProyectos, setShowProyectos] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [showProyectoForm, setShowProyectoForm] = useState(false);
  const [refreshProyectos, setRefreshProyectos] = useState(false);
  const [selectedProyectoId, setSelectedProyectoId] = useState(null);

  // Profesores
  const [showProfesores, setShowProfesores] = useState(false);

  // Estudiantes
  const handleSelect = (id) => {
    setSelectedId(id);
    setShowForm(false);
  };
  const handleEdit = async (est) => {
    const response = await fetch(`http://localhost:8080/api/estudiantes/${est.id}`);
    const data = await response.json();
    setEditingEst(data);
    setShowForm(true);
  };
  const handleCreate = () => {
    setEditingEst(null);
    setShowForm(true);
  };
  const handleSave = async (est) => {
    const wasSelected = selectedId === est.id; // Check if we were viewing this student's report
    
    try {
      if (est.id) {
        const response = await fetch(`http://localhost:8080/api/estudiantes/${est.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(est)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const response = await fetch('http://localhost:8080/api/estudiantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(est)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      setShowForm(false);
      const newRefreshKey = Date.now(); // Generate a unique refresh key
      setRefresh(newRefreshKey);
      
      // If we were viewing this student's report, keep it selected and force refresh
      if (wasSelected && est.id) {
        setSelectedId(est.id);
        // Small delay to ensure backend processing is complete
        setTimeout(() => {
          setRefresh(Date.now());
        }, 500);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error al guardar el estudiante: ' + error.message);
    }
  };

  // Cursos
  const handleSelectCurso = (cursoId) => {
    setSelectedCursoId(cursoId);
  };
  const handleEditCurso = (curso) => {
    setEditingCurso(curso);
    setShowCursoForm(true);
  };
  const handleCreateCurso = () => {
    setEditingCurso(null);
    setShowCursoForm(true);
  };
  const handleSaveCurso = async (curso) => {
    if (curso.id) {
      await fetch(`http://localhost:8080/api/cursos/${curso.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso)
      });
    } else {
      await fetch('http://localhost:8080/api/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso)
      });
    }
    setShowCursoForm(false);
    setRefreshCursos(!refreshCursos);
  };

  // Proyectos
  const handleSelectProyecto = (proyectoId) => {
    setSelectedProyectoId(proyectoId);
  };
  const handleEditProyecto = (proy) => {
    setEditingProyecto(proy);
    setShowProyectoForm(true);
  };
  const handleCreateProyecto = () => {
    setEditingProyecto(null);
    setShowProyectoForm(true);
  };
  const handleSaveProyecto = async (proy) => {
    if (proy.id) {
      await fetch(`http://localhost:8080/api/proyectos/${proy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proy)
      });
    } else {
      await fetch('http://localhost:8080/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proy)
      });
    }
    setShowProyectoForm(false);
    setRefreshProyectos(!refreshProyectos);
  };

  return (
    <div className="App">
      {/* Header Minimalista */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">Sistema de Gestión Académica</h1>
            <p className="app-subtitle">Universidad Tecnológica del Perú</p>
          </div>
        </div>
      </header>

      {/* Navegación Principal */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-buttons">
            <button
              className={`nav-btn ${!showCursos && !showProyectos && !showProfesores ? 'active' : ''}`}
              onClick={() => {
                setShowCursos(false);
                setShowProyectos(false);
                setShowProfesores(false);
                setSelectedId(null);
                setShowForm(false);
              }}
            >
              👥 Estudiantes
            </button>
            <button
              className={`nav-btn ${showCursos ? 'active' : ''}`}
              onClick={() => {
                setShowCursos(true);
                setShowProyectos(false);
                setShowProfesores(false);
                setSelectedCursoId(null);
                setShowCursoForm(false);
              }}
            >
              📚 Cursos
            </button>
            <button
              className={`nav-btn ${showProfesores ? 'active' : ''}`}
              onClick={() => {
                setShowProfesores(true);
                setShowCursos(false);
                setShowProyectos(false);
              }}
            >
              👨‍🏫 Profesores
            </button>
            <button
              className={`nav-btn ${showProyectos ? 'active' : ''}`}
              onClick={() => {
                setShowProyectos(true);
                setShowCursos(false);
                setShowProfesores(false);
                setSelectedProyectoId(null);
                setShowProyectoForm(false);
              }}
            >
              🚀 Proyectos
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="main-content">
          
          {/* Sección de Estudiantes */}
          {!showCursos && !showProyectos && !showProfesores && (
            <div>
              {showForm ? (
                <EstudianteForm estudiante={editingEst} onSave={handleSave} onCancel={() => setShowForm(false)} />
              ) : (
                <>
                  <EstudiantesTable key={refresh} refreshKey={refresh} onSelect={handleSelect} onEdit={handleEdit} />
                  {selectedId && (
                    <div style={{ marginTop: '2rem' }}>
                      <ReporteEstudiante estudianteId={selectedId} refreshKey={refresh} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sección de Cursos */}
          {showCursos && (
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">📚</span>
                  Gestión de Cursos
                </h2>
                <button 
                  onClick={handleCreateCurso} 
                  className="btn-create cursos"
                >
                  <span>➕</span>
                  Nuevo Curso
                </button>
              </div>
              <div className="section-content">
                {showCursoForm ? (
                  <CursoForm curso={editingCurso} onSave={handleSaveCurso} onCancel={() => setShowCursoForm(false)} />
                ) : (
                  <>
                    <CursosTable key={refreshCursos} refreshKey={refreshCursos} onSelect={handleSelectCurso} onEdit={handleEditCurso} />
                    {selectedCursoId && <CursoDetalle cursoId={selectedCursoId} onClose={() => setSelectedCursoId(null)} />}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Sección de Proyectos */}
          {showProyectos && (
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">🔬</span>
                  Gestión de Proyectos
                </h2>
                <button 
                  onClick={handleCreateProyecto} 
                  className="btn-create proyectos"
                >
                  <span>➕</span>
                  Nuevo Proyecto
                </button>
              </div>
              <div className="section-content">
                {showProyectoForm ? (
                  <ProyectoForm proyecto={editingProyecto} onSave={handleSaveProyecto} onCancel={() => setShowProyectoForm(false)} />
                ) : (
                  <>
                    <ProyectosTable key={refreshProyectos} refreshKey={refreshProyectos} onSelect={handleSelectProyecto} onEdit={handleEditProyecto} />
                    {selectedProyectoId && <ProyectoDetalle proyectoId={selectedProyectoId} onClose={() => setSelectedProyectoId(null)} />}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Sección de Profesores */}
          {showProfesores && (
            <ProfesoresTable />
          )}

      </main>
    </div>
  );
}

export default App;
