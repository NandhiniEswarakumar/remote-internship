import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#fda085', '#f6d365', '#a1c4fd', '#c2e9fb'];

export default function ApplicationStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    const counts = apps.reduce((acc, a) => { const s = a.status || 'Submitted'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
    const arr = Object.entries(counts).map(([name, value]) => ({ name, value }));
    setData(arr);
  }, []);

  if (data.length === 0) return <div>No application data for chart.</div>;

  return (
    <div>
      <h3>Application Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
