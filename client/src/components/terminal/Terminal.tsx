import React, { useState, useRef, useEffect } from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalSection from './TerminalSection';

interface TerminalProps {
  response: string | null;
  stderr: string | null;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ response, stderr, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const terminalBottom = window.innerHeight;
      const newHeight = terminalBottom - e.clientY;
      
      // Constrain height between 150px and 80% of viewport height
      const constrainedHeight = Math.min(
        Math.max(150, newHeight),
        window.innerHeight * 0.8
      );
      
      setHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!response && !stderr) return null;

  return (
    <div 
      ref={terminalRef}
      className="fixed bottom-0 right-0 w-[calc(100%-4rem)] bg-gray-900 rounded-t-lg shadow-xl border border-gray-700 transition-all duration-300 ease-in-out z-50"
      style={{ height: isMinimized ? '40px' : height }}
    >
      <div
        className="absolute -top-1 left-0 right-0 h-1 bg-transparent cursor-ns-resize hover:bg-blue-500/50 transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />
      
      <TerminalHeader
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onClose={onClose}
      />
      
      {!isMinimized && (
        <div className="p-4 space-y-4 h-[calc(100%-40px)] overflow-y-auto custom-scrollbar">
          {response && <TerminalSection title="Response" content={response} />}
          {stderr && <TerminalSection title="Stderr" content={stderr} />}
        </div>
      )}
    </div>
  );
}

export default Terminal;