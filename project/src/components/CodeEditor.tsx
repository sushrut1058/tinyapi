import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[calc(100vh-20rem)] bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Write your API code here..."
      spellCheck={false}
    />
  );
}

export default CodeEditor;