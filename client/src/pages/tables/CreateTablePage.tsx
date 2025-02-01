import React from 'react';
import CreateTable from '../../components/tables/CreateTable';

export const CreateTablePage = () => {
  return (
    <div className="min-h-screen h-screen bg-gray-900 overflow-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="rounded-lg shadow p-6 pt-20">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Create New Table</h1>
          <div className="max-h-[80vh] p-2">
          <CreateTable />
          </div>
        </div>
      </div>
    </div>
  );
};

// export default CreateTablePage;