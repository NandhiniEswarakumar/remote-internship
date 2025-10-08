import React, { useState } from 'react';

export default function InternshipForm({ onAdd }) {
  const [form, setForm] = useState({ position:'', company:'', location:'', deadline:'', description:'' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.position || !form.company) return alert('Please fill required fields');
    onAdd({ ...form, id: Date.now() });
    setForm({ position:'', company:'', location:'', deadline:'', description:'' });
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid', gap:10}}>
      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <input name="deadline" type="date" placeholder="Deadline" value={form.deadline} onChange={handleChange} />
      <textarea name="description" placeholder="Short description" rows={3} value={form.description} onChange={handleChange} />
      <button className="btn" type="submit">Add Internship</button>
    </form>
  );
}
