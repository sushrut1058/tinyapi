import React, { useState } from 'react';
import { Plus, Table as TableIcon } from 'lucide-react';
import { Table } from '../../types/tables';

interface TablesSidebarProps {
  tables: Table[];
  onCreateTableClick: () => void;
  onTableSelect: (table: Table) => void;
  selectedTable: Table | null;
}

export const TablesSidebar: React.FC<TablesSidebarProps> = ({
  tables,
  onCreateTableClick,
  onTableSelect,
  selectedTable,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">Database Tables</h3>
        <button
          onClick={onCreateTableClick}
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Table</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {tables.map((table) => (
          <button
            key={table.name}
            onClick={() => onTableSelect(table)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              selectedTable?.name === table.name
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span className="text-sm">{table.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}