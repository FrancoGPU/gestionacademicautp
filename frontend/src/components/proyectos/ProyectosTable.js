import React, { useEffect, useState } from 'react';

function ProyectosTable({ onSelect, onEdit, refreshKey }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/proyectos?_=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setProyectos(data);
        setLoading(false);
      });
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proyecto?')) {
      await fetch(`http://localhost:8080/api/proyectos/${id}`, { method: 'DELETE' });
      setProyectos(proyectos.filter(p => p.id !== id));
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;

  return (
    <table border="1" cellPadding="8" style={{ margin: '2rem auto', width: '80%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Resumen</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proyectos.map(proy => (
          <tr key={proy.id}>
            <td>{proy.id?.substring(0, 8)}...</td>
            <td>{proy.titulo || 'Sin título'}</td>
            <td>{proy.resumen || 'Sin resumen'}</td>
            <td>{proy.fechaInicio || 'No definida'}</td>
            <td>{proy.fechaFin || 'No definida'}</td>
            <td>
              <button onClick={() => onSelect(proy.id)}>Ver</button>
              <button onClick={() => onEdit(proy)}>Editar</button>
              <button onClick={() => handleDelete(proy.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProyectosTable;
