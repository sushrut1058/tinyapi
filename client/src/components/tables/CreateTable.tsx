import React, { useContext, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';
import ErrorMessage from '../ErrorMessage';
import AuthContext from '../../contexts/AuthContext';
import StatusMessage from '../../components/feedback/StatusMessage';

interface Field {
  name: string;
  type: string;
}

const fieldTypes = ['string', 'boolean', 'integer', 'date', 'float'];

export const CreateTable = () => {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState<Field[]>([{ name: '', type: 'string' }]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {accessToken} = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL //"http://localhost:5000"

  const addField = () => {
    setFields([...fields, { name: '', type: 'string' }]);
  };

  const removeField = (index: number) => {
    if (fields.length === 1) {
      setError('Table must have at least one field');
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const validateForm = () => {
    if (!tableName.trim()) {
      setError('Table name is required');
      return false;
    }

    if (fields.some(field => !field.name.trim())) {
      setError('All fields must have names');
      return false;
    }

    const fieldNames = fields.map(f => f.name.trim().toLowerCase());
    if (new Set(fieldNames).size !== fieldNames.length) {
      setError('Field names must be unique');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = async () => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowConfirmation(false);

      const resp = await fetch(`${url}/tables/create`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${accessToken}`
        },
        body: JSON.stringify({"table_name": tableName,"table_columns":fields})
      });

      if(resp.status === 201){
        const data = await resp.json();
        console.log(data);
        setStatus({ type: 'success', message: data['message'] });
      }else if(resp.status === 400) {
        const data = await resp.json();
        console.log(data);
        setError(data.message)
      }else if(resp.status === 500) {
        const data = await resp.json();
        console.log(data);
        setError('An error has occurred, please try again later.')
      }
      // setTableName('');
      // setFields([{ name: '', type: 'string' }]);
    } catch (err) {
      setError('Failed to create table. Please try again.');
    }
  };

  return (
    <div className="overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-300 mb-2">
            Table Name
          </label>
          <input
            id="tableName"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter table name"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-300">Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(index, 'name', e.target.value)}
                className="flex-1 bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Field name"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(index, 'type', e.target.value)}
                className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
        >
          Create Table
        </button>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Create Table"
        message={`Do you want to create the table "${tableName}"?`}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
      />

      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default CreateTable;
