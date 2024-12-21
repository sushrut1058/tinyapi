import React, { useState } from 'react';
import { ApiItem } from '../../types/profile';
import RequestPayload from '../RequestPayload';
import ConfirmationDialog from '../ConfirmationDialog';
import Banner from '../Banner';

interface ApiDetailsProps {
  apis: ApiItem[];
  selectedApi: ApiItem;
  apiCode: string;
  onApiSelect: (api: ApiItem) => void;
  onCodeChange: (code: string) => void;
}

export const ApiDetails: React.FC<ApiDetailsProps> = ({
  apis,
  selectedApi,
  apiCode,
  onApiSelect,
  onCodeChange,
}) => {
  const [method, setMethod] = useState(selectedApi.method);
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [showDeployConfirmation, setShowDeployConfirmation] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleTest = () => {
    setResponse(JSON.stringify({
      status: 'success',
      data: { message: 'Test successful' }
    }, null, 2));
  };

  const handleDeploy = () => {
    setShowDeployConfirmation(true);
  };

  const confirmDeploy = () => {
    setShowDeployConfirmation(false);
    setShowBanner(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">API List</h3>
          <div className="space-y-2">
            {apis.map((api, index) => (
              <button
                key={index}
                onClick={() => onApiSelect(api)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedApi.endpoint === api.endpoint
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{api.endpoint}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-black/20">
                    {api.method}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          
          <textarea
            value={apiCode}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full h-[calc(100vh-32rem)] bg-gray-800 text-gray-300 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <RequestPayload
            headers={headers}
            body={body}
            onHeadersChange={setHeaders}
            onBodyChange={setBody}
          />

          {response && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-300 text-sm font-semibold mb-2">Response</h3>
              <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                {response}
              </pre>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test
            </button>
            <button
              onClick={handleDeploy}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Deploy
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeployConfirmation}
        title="Deploy API"
        message="Do you want to deploy this API?"
        onConfirm={confirmDeploy}
        onCancel={() => setShowDeployConfirmation(false)}
      />

      {showBanner && (
        <Banner
          message="API deployed successfully!"
          onClose={() => setShowBanner(false)}
        />
      )}
    </div>
  );
};