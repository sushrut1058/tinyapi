import React from 'react';
import { Minus, X } from 'lucide-react';

interface TerminalHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ isMinimized, onMinimize, onClose }) => {
  return (
    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700 rounded-t-lg">
      <span className="text-sm font-medium text-gray-300">Response Terminal</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={onMinimize}
          className="p-1 hover:bg-gray-700 rounded"
          title={isMinimized ? "Maximize" : "Minimize"}
        >
          <Minus className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded"
          title="Close"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default TerminalHeader;