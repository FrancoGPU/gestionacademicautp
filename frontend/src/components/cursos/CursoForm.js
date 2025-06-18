import React, { useState } from 'react';

function CursoForm({ curso, onSave, onCancel }) {
  const [form, setForm] = useState(
    curso || { nombre: '', codigo: '', creditos: 0 }
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form, creditos: Number(form.creditos) });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>{form.id ? 'Editar' : 'Crear'} Curso</h2>
        <div className="form-group">
          <label>Nombre: </label>
          <input 
            name="nombre" 
            value={form.nombre || ''} 
            onChange={handleChange} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Código: </label>
          <input 
            name="codigo" 
            value={form.codigo || ''} 
            onChange={handleChange} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Créditos: </label>
          <input 
            name="creditos" 
            type="number" 
            value={form.creditos || 0} 
            onChange={handleChange} 
            required 
            min="0" 
            className="form-input"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CursoForm;