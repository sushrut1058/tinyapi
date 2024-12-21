import React, { useState } from 'react';
import { Table as TableIcon } from 'lucide-react';

interface TableField {
  name: string;
  type: string;
}

interface Table {
  name: string;
  fields: TableField[];
  data: Record<string, any>[];
}

export const ViewTables = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables] = useState<Table[]>([
    {
      name: 'users',
      fields: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'active', type: 'boolean' },
        { name: 'created_at', type: 'date' },
      ],
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {!selectedTable ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table)}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <TableIcon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-200 font-medium">{table.name}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {table.fields.length} fields, {table.data.length} records
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-200">{selectedTable.name}</h2>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-blue-400 hover:text-blue-300"
            >
              Back to tables
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  {selectedTable.fields.map((field) => (
                    <th
                      key={field.name}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-300"
                    >
                      {field.name}
                      <span className="text-gray-500 ml-2">({field.type})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedTable.data.map((row, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    {selectedTable.fields.map((field) => (
                      <td key={field.name} className="px-4 py-3 text-sm text-gray-300">
                        {String(row[field.name])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};