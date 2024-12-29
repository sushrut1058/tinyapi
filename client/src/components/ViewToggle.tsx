import React from 'react';
import { Database, Settings } from 'lucide-react';

interface ViewToggleProps {
  view: 'tables' | 'payload';
  onViewChange: (view: 'tables' | 'payload') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('payload')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
          view === 'payload'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm">Payload</span>
      </button>
      <button
        onClick={() => onViewChange('tables')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
          view === 'tables'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Database className="w-4 h-4" />
        <span className="text-sm">Tables</span>
      </button>
    </div>
  );
};