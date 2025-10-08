import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function InterviewScheduleReport() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const interviews = JSON.parse(localStorage.getItem('interviewFormDraft') || '[]');
    // If only one draft, wrap in array for demo; in real app, use array of interviews
    let arr = Array.isArray(interviews) ? interviews : [interviews];
    // Remove empty drafts
    arr = arr.filter(i => i && i.candidateEmail);
    setData(arr);
  }, []);

  const columns = React.useMemo(() => [
    { Header: 'Candidate', accessor: 'candidateEmail' },
    { Header: 'Date', accessor: 'interviewDate' },
    { Header: 'Time', accessor: 'interviewTime' },
    { Header: 'Mode', accessor: 'mode' },
    { Header: 'Interviewer', accessor: 'interviewer' },
    { Header: 'Status', accessor: 'status' },
  ], []);

  const tableInstance = useTable({ columns, data, globalFilter }, useGlobalFilter, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter: setTableFilter } = tableInstance;

  // Chart: Interviews by Status
  const statusCounts = data.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Interview Schedule Report</h2>
      <div className="mb-3">
        <input
          value={globalFilter}
          onChange={e => { setGlobalFilter(e.target.value); setTableFilter(e.target.value); }}
          placeholder="Search interviews..."
          className="w-100"
          style={{maxWidth: 300}}
        />
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
        <h4 className="mb-2">Interviews by Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f6d365" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
