import React, { useState, useEffect } from 'react';

function ProyectoDetalle({ proyectoId, onClose }) {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    if (proyectoId) {
      // Fetch project details
      fetch(`http://localhost:8080/api/proyectos/${proyectoId}`)
        .then(res => res.json())
        .then(data => {
          setProyecto(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      // Fetch students participating in this project
      fetch('http://localhost:8080/api/estudiantes')
        .then(res => res.json())
        .then(estudiantes => {
          // Filter students who have this project
          const estudiantesConProyecto = estudiantes.filter(est => 
            est.proyectoIds && est.proyectoIds.includes(proyectoId)
          );
          setEstudiantes(estudiantesConProyecto);
        });
    }
  }, [proyectoId]);

  if (loading) return <div>Cargando...</div>;
  if (!proyecto) return <div>Proyecto no encontrado</div>;

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
        maxWidth: '700px',
        width: '90%',
        maxHeight: '80%',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>🔬 Detalle del Proyecto</h2>
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
          <h3 style={{ margin: '0 0 15px 0', color: '#8e44ad' }}>{proyecto.titulo}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>📝 Resumen:</strong>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffffff', 
              borderRadius: '5px', 
              marginTop: '5px',
              border: '1px solid #e0e0e0',
              fontStyle: proyecto.resumen ? 'normal' : 'italic',
              color: proyecto.resumen ? '#333' : '#888'
            }}>
              {proyecto.resumen || 'Sin resumen disponible'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <strong>📅 Fecha de Inicio:</strong>
              <div style={{ 
                padding: '5px 10px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '3px', 
                marginTop: '5px'
              }}>
                {proyecto.fechaInicio || 'No definida'}
              </div>
            </div>
            <div>
              <strong>🏁 Fecha de Fin:</strong>
              <div style={{ 
                padding: '5px 10px', 
                backgroundColor: '#ffe8e8', 
                borderRadius: '3px', 
                marginTop: '5px'
              }}>
                {proyecto.fechaFin || 'No definida'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#9b59b6', borderBottom: '2px solid #9b59b6', paddingBottom: '5px' }}>
            👥 Estudiantes Participantes ({estudiantes.length})
          </h4>
          {estudiantes.length > 0 ? (
            <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '5px' }}>
              {estudiantes.map(est => (
                <div key={est.id} style={{ 
                  padding: '10px 0', 
                  borderBottom: '1px solid #ce93d8',
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
              No hay estudiantes participando en este proyecto
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProyectoDetalle;
