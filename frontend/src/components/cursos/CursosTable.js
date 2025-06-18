import React, { useEffect, useState } from 'react';

function CursosTable({ onSelect, onEdit, refreshKey }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/cursos?_=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setCursos(data);
        setLoading(false);
      });
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este curso?')) {
      await fetch(`http://localhost:8080/api/cursos/${id}`, { method: 'DELETE' });
      setCursos(cursos.filter(c => c.id !== id));
    }
  };

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <table border="1" cellPadding="8" style={{ margin: '2rem auto', width: '80%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Código</th>
          <th>Créditos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cursos.map(curso => (
          <tr key={curso.id}>
            <td>{curso.id}</td>
            <td>{curso.nombre || 'Sin nombre'}</td>
            <td>{curso.codigo || 'Sin código'}</td>
            <td>{curso.creditos || 0}</td>
            <td>
              <button onClick={() => onSelect(curso.id)}>Ver</button>
              <button onClick={() => onEdit(curso)}>Editar</button>
              <button onClick={() => handleDelete(curso.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CursosTable;
