import React, { useEffect, useState } from 'react';

export default function DeadlineTracker() {
  const [soon, setSoon] = useState([]);

  useEffect(() => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const now = new Date();
    const list = internships.filter(i => i.deadline).map(i => ({ ...i, daysLeft: Math.ceil((new Date(i.deadline) - now) / (1000*60*60*24)) }))
      .sort((a,b) => a.daysLeft - b.daysLeft);
    setSoon(list.slice(0,5));
  }, []);

  if (soon.length === 0) return <div>No upcoming deadlines.</div>;

  return (
    <div>
      <h3>Upcoming Deadlines</h3>
      <ul>
        {soon.map(s => (
          <li key={s.id}>
            <strong>{s.position}</strong> at {s.company} — {s.daysLeft} days left
          </li>
        ))}
      </ul>
    </div>
  );
}
