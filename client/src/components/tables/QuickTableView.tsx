import React from 'react';
import { Table } from '../../types/tables';

interface QuickTableViewProps {
  table: Table;
}

export const QuickTableView: React.FC<QuickTableViewProps> = ({ table }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">{table.name}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
              <th className="pb-2">Column</th>
              <th className="pb-2">Type</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {table.fields.map((field, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-2 text-gray-300">{field.name}</td>
                <td className="py-2 text-gray-400">{field.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}