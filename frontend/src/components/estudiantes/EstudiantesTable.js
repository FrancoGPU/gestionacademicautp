import React, { useEffect, useState } from 'react';

function EstudiantesTable({ onSelect, onEdit, refreshKey }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:8080/api/estudiantes?_=' + Date.now())
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar los estudiantes desde el servidor.');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEstudiantes(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
          setEstudiantes([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setEstudiantes([]); // Prevenir error de .map
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este estudiante?')) {
      await fetch(`http://localhost:8080/api/estudiantes/${id}`, { method: 'DELETE' });
      setEstudiantes(estudiantes.filter(e => e.id !== id));
    }
  };

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <table border="1" cellPadding="8" style={{ margin: '2rem auto', width: '80%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(estudiantes) && estudiantes.map(est => (
          <tr key={est.id}>
            <td>{est.id}</td>
            <td>{est.nombre}</td>
            <td>{est.apellido}</td>
            <td>{est.correo}</td>
            <td>
              <button onClick={() => onSelect(est.id)}>Ver</button>
              <button onClick={() => onEdit(est)}>Editar</button>
              <button onClick={() => handleDelete(est.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EstudiantesTable;
