import React from 'react';

export default function InternshipCard({ internship, onDelete }) {
  return (
    <div className="internship-card">
      <h3>{internship.position}</h3>
      <div className="small-muted">Company: {internship.company}</div>
      <div className="small-muted">Location: {internship.location}</div>
      <div className="small-muted">Deadline: {internship.deadline}</div>
      <p style={{marginTop:8}}>{internship.description}</p>
      <div style={{display:'flex', gap:8, marginTop:10}}>
        <button className="btn" onClick={() => alert('Apply flow demo')}>Apply</button>
        <button className="btn" onClick={() => onDelete(internship.id)}>Delete</button>
      </div>
    </div>
  );
}
