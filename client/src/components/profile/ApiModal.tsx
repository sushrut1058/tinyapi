import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { X } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiCode: string;
  method: string;
  apiUrl: string;
  api: any
  onSave: () => void;
  onDelete: () => void;
  onCodeChange: (value: string | undefined) => void;
}

const ApiModal: React.FC<ApiModalProps> = ({
  isOpen,
  onClose,
  apiCode,
  method,
  apiUrl,
  api,
  onSave,
  onDelete,
  onCodeChange,
}) => {
  if (!isOpen) return null;
  const [showDeleteApiConfirm,setShowDeleteApiConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteApiConfirm(true);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-lg bg-gray-800 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-200">Edit API</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* URL Display */}
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-blue-400 font-semibold">{api.method}</span>
            <div className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm text-gray-300 font-mono">
              {api.apiUrl ? api.apiUrl : '/'}
            </div>
          </div>

          {/* Editor */}
          <div className="h-[60vh] border border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={apiCode}
              onChange={onCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>

          <ConfirmationDialog
            isOpen={showDeleteApiConfirm}
            title={`Delete Table ${api.name}`}
            message={`Are you sure you want to delete table: ${api.name}? This action cannot be undone.`}
            onConfirm={onDelete}
            onCancel={() => {
              setShowDeleteApiConfirm(false);
            }}
          />

        </div>
      </div>
    </div>
  );
};

export default ApiModal;