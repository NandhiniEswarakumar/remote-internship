import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { exportToCsv } from '../services/csvUtil';

export default function CompanyInsightsReport() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('applications') || '[]') || [];
    // normalize company (fallback to email domain or Unknown)
    const normalized = raw.map(a => {
      const company = a.company || (() => {
        if (a.email && a.email.includes('@')) return a.email.split('@')[1].split('.')[0];
        return 'Unknown';
      })();
      return { ...a, company };
    });
    setApps(normalized);
  }, []);

  const counts = useMemo(() => {
    const by = {};
    apps.forEach(a => { const c = a.company || 'Unknown'; by[c] = (by[c] || 0) + 1; });
    const arr = Object.entries(by).map(([company, count]) => ({ company, count }));
    return arr.sort((x,y) => y.count - x.count);
  }, [apps]);

  const chartData = counts.map((c,i) => ({ name: c.company, count: c.count }));

  function handleBarClick(data) {
    if (!data) return;
    setSelected(data.name);
  }

  function clearSelection() { setSelected(null); }

  const applicants = selected ? apps.filter(a => (a.company || 'Unknown') === selected) : [];

  if (!apps || apps.length === 0) return <div className="container">No applications available to compute company insights.</div>;

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Company Insights</h2>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={() => exportToCsv(counts, 'company-insights.csv')}>Export CSV</button>
          <button className="btn" onClick={() => { localStorage.removeItem('applications'); setApps([]); setSelected(null); }}>Clear data</button>
        </div>
      </div>

      <div style={{marginTop:12}} className="chart-container">
        <h4 className="mb-2">Top Companies by Application Count</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }} onClick={(e) => handleBarClick(e && e.activeLabel ? { name: e.activeLabel } : null)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f6d365" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{marginTop:18}}>
        <h4>Companies</h4>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {counts.map(c => (
            <div key={c.company} className="company-pill" onClick={() => setSelected(c.company)}>
              {c.company} <strong style={{marginLeft:8}}>{c.count}</strong>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{marginTop:18}}>
          <h4>Applicants from: {selected} <button className="btn" style={{marginLeft:12}} onClick={clearSelection}>Close</button></h4>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{padding:8, textAlign:'left'}}>Name</th>
                  <th style={{padding:8, textAlign:'left'}}>Email</th>
                  <th style={{padding:8, textAlign:'left'}}>Position</th>
                  <th style={{padding:8, textAlign:'left'}}>Status</th>
                  <th style={{padding:8, textAlign:'left'}}>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{padding:8}}>{(a.firstName||'') + (a.lastName ? ' ' + a.lastName : '')}</td>
                    <td style={{padding:8}}>{a.email}</td>
                    <td style={{padding:8}}>{a.position}</td>
                    <td style={{padding:8}}>{a.status}</td>
                    <td style={{padding:8}}>{a.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
