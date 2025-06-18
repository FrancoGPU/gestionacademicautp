import React, { useState } from 'react';

function ProyectoForm({ proyecto, onSave, onCancel }) {
  const [form, setForm] = useState(
    proyecto || { titulo: '', resumen: '', fechaInicio: '', fechaFin: '' }
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '2rem auto', width: '60%' }}>
      <h2>{form.id ? 'Editar' : 'Crear'} Proyecto</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Título: </label>
        <input name="titulo" value={form.titulo || ''} onChange={handleChange} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Resumen: </label>
        <textarea name="resumen" value={form.resumen || ''} onChange={handleChange} rows="3" style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Fecha Inicio: </label>
        <input name="fechaInicio" type="date" value={form.fechaInicio || ''} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Fecha Fin: </label>
        <input name="fechaFin" type="date" value={form.fechaFin || ''} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancelar</button>
    </form>
  );
}

export default ProyectoForm;
