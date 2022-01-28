import React from 'react';
import style from './strippedtable.module.css';

const StripedTable = ({ head, children }) => {
  return (
    <table className={style['stripped-table']}>
      {head ? (
        <thead>
          <tr>
            {head.map((row) => (
              <th key={row.text} style={row.style}>
                {row.text}
              </th>
            ))}
          </tr>
        </thead>
      ) : null}
      <tbody className="text-gray-700">{children}</tbody>
    </table>
  );
};

export default StripedTable;
