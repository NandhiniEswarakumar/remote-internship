import React, { useEffect, useState } from 'react';
import { internshipService } from '../services/internshipService';

export default function InternshipTable() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ field: 'deadline', dir: 'asc' });

  useEffect(() => {
    internshipService.getAll().then(setRows);
  }, []);

  function handleDelete(id) {
    internshipService.remove(id).then(() => internshipService.getAll().then(setRows));
  }

  function filtered() {
    if (!q) return rows;
    return rows.filter(r => (r.position + ' ' + r.company + ' ' + r.location).toLowerCase().includes(q.toLowerCase()));
  }

  function sorted() {
    const data = [...filtered()];
    data.sort((a,b) => {
      const aVal = a[sort.field] || '';
      const bVal = b[sort.field] || '';
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }

  return (
    <div>
      <h2>Internship Table</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
        <select value={sort.field} onChange={e => setSort(s => ({ ...s, field: e.target.value }))}>
          <option value="deadline">Deadline</option>
          <option value="company">Company</option>
          <option value="position">Position</option>
        </select>
        <button className="btn" onClick={() => setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))}>Toggle Dir</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Company</th>
            <th>Location</th>
            <th>Deadline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted().map(r => (
            <tr key={r.id}>
              <td>{r.position}</td>
              <td>{r.company}</td>
              <td>{r.location}</td>
              <td>{r.deadline}</td>
              <td><button className="btn" onClick={() => handleDelete(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
