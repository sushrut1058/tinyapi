import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import RequestPayload from '../components/RequestPayload';
import ResponseViewer from '../components/ResponseViewer';
import Banner from '../components/Banner';
import { Play, Upload } from 'lucide-react';

const Home = () => {
  const [method, setMethod] = useState('GET');
  const [code, setCode] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  const handleTest = () => {
    // Simulate API test
    setResponse(JSON.stringify({
      status: 'success',
      data: { message: 'Test successful' }
    }, null, 2));
  };

  const handleDeploy = () => {
    setShowBanner(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pl-16">
      <div className="max-w-6xl mx-auto p-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
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
            <div className="flex-1" />
            <button
              onClick={handleTest}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Test</span>
            </button>
            <button
              onClick={handleDeploy}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Deploy</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">API Code</h2>
              <CodeEditor value={code} onChange={setCode} />
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Request Payload</h2>
              <RequestPayload
                headers={headers}
                body={body}
                onHeadersChange={setHeaders}
                onBodyChange={setBody}
              />
            </div>
          </div>

          <ResponseViewer response={response} />
        </div>
      </div>

      {showBanner && (
        <Banner
          message="API deployed successfully!"
          onClose={() => setShowBanner(false)}
        />
      )}
    </div>
  );
};

export default Home;