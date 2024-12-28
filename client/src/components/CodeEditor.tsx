import React, { useCallback } from 'react';
import Monaco from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

// Pre-load Monaco for better performance
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const handleEditorChange = useCallback((newValue: string | undefined) => {
    onChange(newValue || '');
  }, [onChange]);

  return (
    <div className="w-full h-[calc(100vh-16rem)] rounded-lg overflow-hidden border border-gray-800">
      <Monaco
        height="100%"
        defaultLanguage="python"
        value={value}
        onChange={handleEditorChange}
        options={{
          theme: 'vs-dark',
          automaticLayout: true,
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          minimap: {
            enabled: true,
            scale: 0.75,
            showSlider: 'mouseover'
          },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
          folding: true,
          foldingHighlight: true,
          foldingStrategy: 'auto',
          showFoldingControls: 'mouseover',
          bracketPairColorization: {
            enabled: true
          },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabSize: 4,
          insertSpaces: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
      />
    </div>
  );
}

export default CodeEditor;