import React from 'react';

interface ResponseViewerProps {
  response: string | null;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  if (!response) return null;

  return (
    <div className="mt-4 bg-gray-900 rounded-lg p-4">
      <h3 className="text-gray-300 text-sm font-semibold mb-2">Response</h3>
      <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
        {response}
      </pre>
    </div>
  );
};

export default ResponseViewer;