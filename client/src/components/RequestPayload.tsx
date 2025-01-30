import React from 'react';
import ParameterInput from './parameters/ParameterInput';
import Editor from "@monaco-editor/react";

interface RequestPayloadProps {
  headers: { id: string; key: string; value: string }[];
  queryParams: { id: string; key: string; value: string }[];
  pathParams: { id: string; key: string; value: string }[];
  body: string;
  onHeadersChange: (headers: { id: string; key: string; value: string }[]) => void;
  onQueryParamsChange: (params: { id: string; key: string; value: string }[]) => void;
  onPathParamsChange: (params: { id: string; key: string; value: string }[]) => void;
  onBodyChange: (body: string) => void;
}

const RequestPayload: React.FC<RequestPayloadProps> = ({
  headers,
  queryParams,
  pathParams,
  body,
  onHeadersChange,
  onQueryParamsChange,
  onPathParamsChange,
  onBodyChange,
}) => {
  return (
    <div className="h-[calc(100vh-16rem)] bg-gray-900 rounded-lg p-4">
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <ParameterInput
            parameters={pathParams}
            onParametersChange={onPathParamsChange}
            title="Path Parameters"
            addButtonText="Add Path Parameter"
          />

          <ParameterInput
            parameters={queryParams}
            onParametersChange={onQueryParamsChange}
            title="Query Parameters"
            addButtonText="Add Query Parameter"
          />

          <ParameterInput
            parameters={headers}
            onParametersChange={onHeadersChange}
            title="Headers"
            addButtonText="Add Header"
          />

          <div className="space-y-2">
            <h3 className="text-gray-300 text-sm font-semibold">Body</h3>
            <Editor
              height="8rem"
              defaultLanguage="json"
              value={body}
              onChange={(value) => onBodyChange(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingIndent: "indent",
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPayload;