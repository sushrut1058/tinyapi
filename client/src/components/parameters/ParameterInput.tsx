import React from 'react';
import { Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 

interface ParameterInputProps {
  parameters: { id: string; key: string; value: string }[];
  onParametersChange: (params: { id: string; key: string; value: string }[]) => void;
  title: string;
  addButtonText: string;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  parameters,
  onParametersChange,
  title,
  addButtonText,
}) => {
  const addParameter = () => {
    onParametersChange([...parameters, { id: uuidv4(), key: '', value: '' }]);
  };


  const updateParameter = (id: string, key: string, value: string) => {
    const updatedParams = parameters.map((param) =>
      param.id === id ? { ...param, key, value } : param
    );
    onParametersChange(updatedParams);
  };

  const removeParameter = (id: string) => {
    const updatedParams = parameters.filter((param) => param.id !== id);
    onParametersChange(updatedParams);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-300 text-sm font-semibold">{title}</h3>
        <button
          onClick={addParameter}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          {addButtonText}
        </button>
      </div>
      <div className="space-y-2">
        {parameters.map(({id, key, value}) => (
          <div key={id} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
            <input
              type="text"
              value={key}
              onChange={(e) => updateParameter(id, e.target.value, value)}
              placeholder="Name"
              className="w-full bg-gray-800 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateParameter(id, key, e.target.value)}
              placeholder="Value"
              className="w-full bg-gray-800 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => removeParameter(id)}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterInput;