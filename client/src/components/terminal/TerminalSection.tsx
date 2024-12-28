import React from 'react';

interface TerminalSectionProps {
  title: string;
  content: string;
}

const TerminalSection: React.FC<TerminalSectionProps> = ({ title, content }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-green-400">❯</span>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap pl-4">
        {content}
      </pre>
    </div>
  );
}

export default TerminalSection;