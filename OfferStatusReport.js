import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#fda085', '#f6d365', '#a1c4fd', '#c2e9fb'];

export default function OfferStatusReport() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const offer = localStorage.getItem('offerConfirmationDraft');
    let offers = [];
    if (offer) {
      const parsed = JSON.parse(offer);
      if (Array.isArray(parsed)) offers = parsed;
      else if (parsed.candidateEmail) offers = [parsed];
    }
    setData(offers);
  }, []);

  const columns = React.useMemo(() => [
    { Header: 'Candidate', accessor: 'candidateEmail' },
    { Header: 'Status', accessor: 'offerStatus' },
    { Header: 'Joining Date', accessor: 'joiningDate' },
    { Header: 'Stipend', accessor: 'stipend' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Manager', accessor: 'manager' },
  ], []);

  const tableInstance = useTable({ columns, data, globalFilter }, useGlobalFilter, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter: setTableFilter } = tableInstance;

  // Chart: Offers by Status
  const statusCounts = data.reduce((acc, o) => {
    acc[o.offerStatus] = (acc[o.offerStatus] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(statusCounts).map(([status, value]) => ({ name: status, value }));

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Offer Status Report</h2>
      <div className="mb-3">
        <input
          value={globalFilter}
          onChange={e => { setGlobalFilter(e.target.value); setTableFilter(e.target.value); }}
          placeholder="Search offers..."
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
        <h4 className="mb-2">Offers by Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
