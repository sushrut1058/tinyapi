import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:text-red-100"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;