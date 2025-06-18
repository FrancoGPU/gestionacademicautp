import React, { useState, useEffect } from 'react';

function ReporteEstudiante({ estudianteId, refreshKey }) {
  const [id, setId] = useState(estudianteId || '');
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (estudianteId) {
      setId(estudianteId);
      handleBuscar(estudianteId);
    }
    // eslint-disable-next-line
  }, [estudianteId]);

  // Additional effect to refresh when refreshKey changes, even with same student
  useEffect(() => {
    if (estudianteId && refreshKey !== undefined) {
      handleBuscar(estudianteId);
    }
    // eslint-disable-next-line
  }, [refreshKey, estudianteId]);

  const handleBuscar = async (idBuscar) => {
    setLoading(true);
    setReporte(null);
    try {
      const timestamp = Date.now();
      const res = await fetch(`http://localhost:8080/api/reportes/estudiante/${idBuscar || id}?_=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }); // cache busting with headers
      if (res.ok) {
        const data = await res.json();
        setReporte(data);
      } else {
        setReporte(null);
      }
    } catch (error) {
      setReporte(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: '2rem auto', width: '60%', background: '#fafafa', padding: 20, borderRadius: 10 }}>
      <h2>Reporte Integral de Estudiante</h2>
      {!estudianteId && (
        <div style={{ marginBottom: 20 }}>
          <input value={id} onChange={e => setId(e.target.value)} placeholder="ID estudiante" />
          <button onClick={() => handleBuscar()}>Buscar</button>
        </div>
      )}
      {loading && <p>Cargando...</p>}
      {reporte ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20, padding: 15, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
            <h3 style={{ margin: 0, color: '#1976d2' }}>
              {reporte.estudiante.nombre} {reporte.estudiante.apellido}
            </h3>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <b>Correo:</b> {reporte.estudiante.correo}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <b>Fecha de Nacimiento:</b> {reporte.estudiante.fecha_nacimiento || 'No definida'}
            </p>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: 5 }}>
              📚 Cursos Asociados
            </h4>
            {reporte.cursos && reporte.cursos.length > 0 ? (
              <div style={{ backgroundColor: '#f1f8e9', padding: 10, borderRadius: 5 }}>
                {reporte.cursos.map(c => (
                  <div key={c.id} style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #c8e6c9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span><b>{c.nombre}</b> ({c.codigo})</span>
                    <span style={{ 
                      backgroundColor: '#4caf50', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: 12, 
                      fontSize: '12px' 
                    }}>
                      {c.creditos} créditos
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#fff3e0', 
                padding: 15, 
                borderRadius: 5, 
                fontStyle: 'italic',
                textAlign: 'center',
                color: '#e65100'
              }}>
                No hay cursos asociados a este estudiante
              </div>
            )}
          </div>
          
          <div>
            <h4 style={{ color: '#7b1fa2', borderBottom: '2px solid #7b1fa2', paddingBottom: 5 }}>
              🔬 Proyectos de Investigación
            </h4>
            {reporte.proyectos && reporte.proyectos.length > 0 ? (
              <div style={{ backgroundColor: '#f3e5f5', padding: 10, borderRadius: 5 }}>
                {reporte.proyectos.map(p => (
                  <div key={p.id} style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #ce93d8',
                    marginBottom: 8
                  }}>
                    <div style={{ marginBottom: 5 }}>
                      <b style={{ color: '#4a148c' }}>{p.titulo}</b>
                    </div>
                    {p.resumen && (
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#666', 
                        fontStyle: 'italic',
                        marginBottom: 5 
                      }}>
                        {p.resumen}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {p.fechaInicio && <span>📅 Inicio: {p.fechaInicio}</span>}
                      {p.fechaInicio && p.fechaFin && <span> | </span>}
                      {p.fechaFin && <span>📅 Fin: {p.fechaFin}</span>}
                      {!p.fechaInicio && !p.fechaFin && <span>⏰ Fechas no definidas</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#fff3e0', 
                padding: 15, 
                borderRadius: 5, 
                fontStyle: 'italic',
                textAlign: 'center',
                color: '#e65100'
              }}>
                No hay proyectos de investigación asociados a este estudiante
              </div>
            )}
          </div>
        </div>
      ) : !loading && estudianteId && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          padding: 15, 
          borderRadius: 5, 
          textAlign: 'center',
          color: '#c62828'
        }}>
          ❌ No se encontró reporte para el estudiante con ID: {estudianteId}
        </div>
      )}
    </div>
  );
}

export default ReporteEstudiante;
