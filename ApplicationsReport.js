import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { exportToCsv } from '../services/csvUtil';

export default function ApplicationsReport() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const sampleData = useMemo(() => ([
    { firstName:'Ava', lastName:'Lee', email:'ava@example.com', department:'Engineering', position:'Frontend Intern', status:'Interviewing', submittedAt:'2025-10-01' },
    { firstName:'Sam', lastName:'Ng', email:'sam@example.com', department:'Design', position:'UX Intern', status:'Submitted', submittedAt:'2025-09-25' },
    { firstName:'Ravi', lastName:'Patel', email:'ravi@example.com', department:'Engineering', position:'Backend Intern', status:'Offer', submittedAt:'2025-10-03' }
  ]), []);

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]') || [];
    // normalize: add a `name` field so react-table can use string accessors (stable ids)
    const normalized = applications.map(a => ({ ...a, name: (a.firstName || '') + (a.lastName ? ' ' + a.lastName : '') }));
    setData(normalized);
  }, []);

  function formatDate(value) {
    if (!value) return '';
    try {
      const d = new Date(value);
      return isNaN(d) ? value : new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'numeric' }).format(d);
    } catch (e) { return value; }
  }

  function statusBadge(val) {
    const s = (val || 'Submitted').toString();
    const key = s.toLowerCase();
    return <span className={`status-badge status-${key}`}>{s}</span>;
  }

  const columns = React.useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Position', accessor: 'position' },
    { Header: 'Status', accessor: 'status', Cell: ({ value }) => statusBadge(value) },
    { Header: 'Submitted At', accessor: 'submittedAt', Cell: ({ value }) => formatDate(value) },
  ], []);

  const tableInstance = useTable({ columns, data, globalFilter }, useGlobalFilter, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter: setTableFilter } = tableInstance;

  // Chart: Applications by Department
  const deptCounts = data.reduce((acc, app) => {
    acc[app.department] = (acc[app.department] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(deptCounts).map(([dept, count]) => ({ department: dept, count }));

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Applications Report</h2>
      <div style={{display:'flex', gap:8, justifyContent:'space-between', alignItems:'center'}} className="mb-3">
        <div>
          <input
            value={globalFilter}
            onChange={e => { setGlobalFilter(e.target.value); setTableFilter(e.target.value); }}
            placeholder="Search applications..."
            className="w-100"
            style={{maxWidth: 320}}
          />
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={() => { if (window.confirm('Import sample applications for testing? This will overwrite existing sample entries.')) { localStorage.setItem('applications', JSON.stringify(sampleData)); setData(sampleData); } }}>Import sample data</button>
          <button className="btn" onClick={() => exportToCsv(data, 'applications.csv')}>Export CSV</button>
        </div>
      </div>
      <div style={{overflowX: 'auto'}}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="chart-container">
        <h4 className="mb-2">Applications by Department</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#fda085" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
