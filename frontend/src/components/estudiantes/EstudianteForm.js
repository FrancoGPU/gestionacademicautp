import React, { useState, useEffect } from 'react';

function EstudianteForm({ estudiante, onSave, onCancel }) {
  const [form, setForm] = useState(
    estudiante || { nombre: '', apellido: '', correo: '', fecha_nacimiento: '' }
  );
  const [cursos, setCursos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [selectedCursos, setSelectedCursos] = useState(estudiante?.cursoIds || []);
  const [selectedProyectos, setSelectedProyectos] = useState(estudiante?.proyectoIds || []);

  useEffect(() => {
    fetch('http://localhost:8080/api/cursos').then(res => res.json()).then(setCursos);
    fetch('http://localhost:8080/api/proyectos').then(res => res.json()).then(setProyectos);
  }, []);

  useEffect(() => {
    if (estudiante) {
      setForm(estudiante);
      setSelectedCursos(estudiante.cursoIds || []);
      setSelectedProyectos(estudiante.proyectoIds || []);
    }
  }, [estudiante]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e, setter) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setter(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ 
      ...form, 
      cursoIds: selectedCursos.map(Number),
      proyectoIds: selectedProyectos
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '2rem auto', width: '60%' }}>
      <h2>{form.id ? 'Editar' : 'Crear'} Estudiante</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Nombre: </label>
        <input name="nombre" value={form.nombre || ''} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Apellido: </label>
        <input name="apellido" value={form.apellido || ''} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Correo: </label>
        <input name="correo" value={form.correo || ''} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Fecha Nacimiento: </label>
        <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento || ''} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Cursos:</label>
        <select multiple value={selectedCursos} onChange={e => handleMultiSelectChange(e, setSelectedCursos)} style={{height: 100, width: '100%'}}>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <small>Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples elementos</small>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Proyectos:</label>
        <select multiple value={selectedProyectos} onChange={e => handleMultiSelectChange(e, setSelectedProyectos)} style={{height: 100, width: '100%'}}>
          {proyectos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
        </select>
        <small>Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples elementos</small>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancelar</button>
    </form>
  );
}

export default EstudianteForm;
