import React, { useState } from 'react';

import {CreateTable} from './CreateTable';
import {ViewTables} from './ViewTables';

const TablesView = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-6">
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Create Table
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'view'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          View Tables
        </button>
      </div>

      {activeTab === 'create' ? <CreateTable /> : <ViewTables />}
    </div>
  );
};

export default TablesView;