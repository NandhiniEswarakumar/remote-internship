import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [display, setDisplay] = useState({ internships: 0, applications: 0 });

  useEffect(() => {
    try {
      const internships = JSON.parse(localStorage.getItem('internships') || '[]');
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  const s = { internships: internships.length, applications: applications.length };

      // simple count-up animation
      const duration = 600; // ms
      const steps = 30;
      const interval = Math.max(12, Math.floor(duration / steps));
      let step = 0;
      const start = { internships: 0, applications: 0 };
      const timer = setInterval(() => {
        step += 1;
        const t = step / steps;
        setDisplay({
          internships: Math.round(start.internships + (s.internships - start.internships) * t),
          applications: Math.round(start.applications + (s.applications - start.applications) * t),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    } catch (e) {
      // ignore
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <h1>Remote Internship Application Tracker</h1>
      <p className="mb-3">A lightweight tracker to manage internship leads, applications, interviews and offers — fast and focused.</p>

      <div className="hero-actions">
        <button type="button" className="action-tile" onClick={() => navigate('/internships')} aria-label="View Internships">
          <div className="tile-title">Internships</div>
          <div className="tile-sub">View & manage internship leads</div>
        </button>
        <button type="button" className="action-tile" onClick={() => navigate('/internship-table')} aria-label="Internship Table">
          <div className="tile-title">Internship Table</div>
          <div className="tile-sub">Compact table view</div>
        </button>
        <button type="button" className="action-tile" onClick={() => navigate('/application')} aria-label="New Application">
          <div className="tile-title">New Application</div>
          <div className="tile-sub">Submit or edit applications</div>
        </button>
        <button type="button" className="action-tile" onClick={() => navigate('/company-insights')} aria-label="Company Insights">
          <div className="tile-title">Company Insights</div>
          <div className="tile-sub">See company-level metrics</div>
        </button>
      </div>

      <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:18}}>
        <div className="home-stat">
          <div className="home-stat-value count-anim">{display.internships}</div>
          <div className="small-muted">Internship Leads</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value count-anim">{display.applications}</div>
          <div className="small-muted">Applications</div>
        </div>
      </div>
    </div>
  );
}
