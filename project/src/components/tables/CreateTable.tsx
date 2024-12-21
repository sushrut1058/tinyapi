import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';
import Banner from '../Banner';

interface Field {
  name: string;
  type: string;
}

const fieldTypes = ['string', 'boolean', 'integer', 'date', 'float'];

export const CreateTable = () => {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState<Field[]>([{ name: '', type: 'string' }]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const addField = () => {
    setFields([...fields, { name: '', type: 'string' }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowBanner(true);
    // Handle table creation logic here
  };

  return (
    <>
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

      {showBanner && (
        <Banner
          message={`Table "${tableName}" created successfully!`}
          onClose={() => setShowBanner(false)}
        />
      )}
    </>
  );
};