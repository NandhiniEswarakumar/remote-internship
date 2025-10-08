import React, { useEffect, useState } from 'react';
import InternshipCard from './InternshipCard';
import InternshipForm from './InternshipForm';
import { internshipService } from '../services/internshipService';
import { exportToCsv } from '../services/csvUtil';

export default function InternshipList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    internshipService.getAll().then(setList);
  }, []);

  function handleAdd(item) {
    internshipService.add(item).then(() => internshipService.getAll().then(setList));
  }

  function handleDelete(id) {
    internshipService.remove(id).then(() => internshipService.getAll().then(setList));
  }

  return (
    <div className="narrow">
      <h2>Internships</h2>
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:8}}>
        <button className="btn" onClick={() => exportToCsv(list, 'internships.csv')}>Export CSV</button>
      </div>
      <InternshipForm onAdd={handleAdd} />
      <div style={{marginTop:18}} className="internship-grid">
        {list.length === 0 ? <div>No internships yet.</div> : list.map(i => (
          <InternshipCard key={i.id} internship={i} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
