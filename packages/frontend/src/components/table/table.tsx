import React from 'react';
import './table.css';
const DataTable = ({ data }: { data: any[] }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return <p>No data to display.</p>;

  const keys = Object.keys(data[0] || {});
  if (keys.length === 0) return <p>No data to display.</p>;

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} className="border p-2">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            {Object.values(item).map((val, i) => (
              <td key={i} className="border p-2">{String(val)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;