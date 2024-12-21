import React from 'react';
import { Plus } from 'lucide-react';

interface RequestPayloadProps {
  headers: Record<string, string>;
  body: string;
  onHeadersChange: (headers: Record<string, string>) => void;
  onBodyChange: (body: string) => void;
}

const RequestPayload: React.FC<RequestPayloadProps> = ({
  headers,
  body,
  onHeadersChange,
  onBodyChange,
}) => {
  const addHeader = () => {
    const newKey = `header${Object.keys(headers).length + 1}`;
    onHeadersChange({ ...headers, [newKey]: '' });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[oldKey];
    newHeaders[newKey] = value;
    onHeadersChange(newHeaders);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-300 text-sm font-semibold">Headers</h3>
          <button
            onClick={addHeader}
            className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-3 h-3" />
            <span>Add Header</span>
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => updateHeader(key, e.target.value, value)}
                placeholder="Key"
                className="flex-1 bg-gray-800 text-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateHeader(key, key, e.target.value)}
                placeholder="Value"
                className="flex-1 bg-gray-800 text-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-gray-300 text-sm font-semibold">Body</h3>
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          className="w-full h-32 bg-gray-800 text-gray-300 text-sm font-mono rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Request body (JSON)"
        />
      </div>
    </div>
  );
};

export default RequestPayload;