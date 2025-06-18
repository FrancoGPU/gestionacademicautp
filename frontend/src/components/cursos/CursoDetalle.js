import React, { useState, useEffect } from 'react';

function CursoDetalle({ cursoId, onClose }) {
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    if (cursoId) {
      // Fetch course details
      fetch(`http://localhost:8080/api/cursos/${cursoId}`)
        .then(res => res.json())
        .then(data => {
          setCurso(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      // Fetch students enrolled in this course
      fetch('http://localhost:8080/api/estudiantes')
        .then(res => res.json())
        .then(estudiantes => {
          // Filter students who have this course
          const estudiantesConCurso = estudiantes.filter(est => 
            est.cursoIds && est.cursoIds.includes(cursoId)
          );
          setEstudiantes(estudiantesConCurso);
        });
    }
  }, [cursoId]);

  if (loading) return <div>Cargando...</div>;
  if (!curso) return <div>Curso no encontrado</div>;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80%',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>📚 Detalle del Curso</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              padding: '8px 15px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕ Cerrar
          </button>
        </div>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2980b9' }}>{curso.nombre}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <strong>📋 Código:</strong>
              <div style={{ padding: '5px 0' }}>{curso.codigo}</div>
            </div>
            <div>
              <strong>🎓 Créditos:</strong>
              <div style={{ padding: '5px 0' }}>{curso.creditos}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#27ae60', borderBottom: '2px solid #27ae60', paddingBottom: '5px' }}>
            👥 Estudiantes Matriculados ({estudiantes.length})
          </h4>
          {estudiantes.length > 0 ? (
            <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px' }}>
              {estudiantes.map(est => (
                <div key={est.id} style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #c8e6c9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    <strong>{est.nombre} {est.apellido}</strong>
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    backgroundColor: '#ffffff', 
                    padding: '2px 8px', 
                    borderRadius: '10px' 
                  }}>
                    {est.correo}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#fff3e0', 
              padding: '15px', 
              borderRadius: '5px', 
              textAlign: 'center',
              fontStyle: 'italic',
              color: '#e65100'
            }}>
              No hay estudiantes matriculados en este curso
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CursoDetalle;
