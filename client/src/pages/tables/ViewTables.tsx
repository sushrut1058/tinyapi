import React, { useContext, useEffect, useState } from 'react';
import { Table2, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table as TableType, TableField } from '../../types/tables';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import StatusMessage from '../../components/feedback/StatusMessage';
import AuthContext from '../../contexts/AuthContext';
import {v4 as uuidv4} from 'uuid';

interface EditableCellProps {
  field: TableField;
  value: any;
  isEditing: boolean;
  onChange: (value: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ field, value, isEditing, onChange }) => {
  if (!isEditing || field.name=='id') return <span>{String(value)}</span>;

  switch (field.type) {
    case 'boolean':
      return (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value === 'true')}
          className="bg-gray-700 text-gray-300 rounded px-2 py-1"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    case 'integer':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-gray-700 text-gray-300 rounded px-2 py-1 w-full"
        />
      );
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-700 text-gray-300 rounded px-2 py-1 w-full"
        />
      );
  }
};

export const ViewTables = () => {
  const [tables, setTables] = useState<TableType[]>([
    {
      name: 'users',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'active', type: 'boolean' },
        { name: 'created_at', type: 'date' },
      ],
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
        { id: 31, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 24, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 23, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
        { id: 14, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 233, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 322, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
        { id: 81, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 29, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 38, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
        { id: 71, name: 'John Doe', email: 'john@example.com', active: true, created_at: '2024-03-15' },
        { id: 244, name: 'Jane Smith', email: 'jane@example.com', active: true, created_at: '2024-03-14' },
        { id: 43, name: 'Bob Johnson', email: 'bob@example.com', active: false, created_at: '2024-03-13' },
      ],
    },
  ]);
  
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableList, setTableList] = useState([])
  const rowsPerPage = 10;
  const url = import.meta.env.VITE_API_URL 

  const {accessToken} = useContext(AuthContext);

  const fetchTableList = async () => {
    try{
      const resp = await fetch(`${url}/tables/list/schema/`,{
        'method':'GET',
        'headers':{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`
        }
      });
      const data = await resp.json()
      
      if(resp.status === 200){
        console.log(data);
        const transformed_data = data['message'].map((item, index)=> ({name:item['name'], fields:item['fields'].length, id: index+1}))
        console.log(transformed_data);
        setTableList(transformed_data);
      }else if(resp.status === 500) {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
      // setError
    }
  }

  useEffect(()=>{fetchTableList()},[])

  const fetchTableRecords = async (table_name: string) => {
    try{
      const resp = await fetch(`${url}/tables/view/${table_name}`, {
        method:'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`
        }
      });
      let data = await resp.json();
      if(resp.status===200){
        console.log(data);
        setSelectedTable(data['message'])
    }else if(resp.status!==500){
        console.log('failure');
      }
    }catch(e){
      console.log(e);
    }
      
  }

  const handleEdit = (row: any) => {
    setEditingRow(row.id);
    setEditedData({ ...row });
  };

  const handleSave = async (row: any) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTables(current =>
        current.map(table => {
          if (table === selectedTable) {
            return {
              ...table,
              data: table.data.map(item =>
                item.id === row.id ? { ...editedData } : item
              ),
            };
          }
          return table;
        })
      );
      
      setEditingRow(null);
      setEditedData({});
      setStatus({ type: 'success', message: 'Row updated successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update row' });
    }
  };

  const handleDelete = (rowId: number) => {
    setRowToDelete(rowId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTables(current =>
        current.map(table => {
          if (table === selectedTable) {
            return {
              ...table,
              data: table.data.filter(item => item.id !== rowToDelete),
            };
          }
          return table;
        })
      );
      
      setShowDeleteConfirm(false);
      setRowToDelete(null);
      setStatus({ type: 'success', message: 'Row deleted successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete row' });
    }
  };

  // Calculate pagination
  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = selectedTable ? Math.ceil(selectedTable.data.length / rowsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCellChange = (fieldName: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-100">Database Tables</h1>
        <p className="text-gray-400 mt-2">View and manage your database tables</p>
      </div>

      {!selectedTable ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tableList.map((table) => (
            <button
              key={table.name}
              onClick={() => {
                fetchTableRecords(table.name);
                setCurrentPage(1);
              }}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Table2 className="w-5 h-5 text-blue-400" />
                <span className="text-gray-200 font-medium">{table.name}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Columns: {table.fields}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-200">{selectedTable.name}</h2>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-blue-400 hover:text-blue-300"
            >
              Back to tables
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="max-h-96 overflow-y-auto custom-scrollbar"> 
            <table className="min-w-full">
              <thead className="sticky top-0 bg-gray-900">
                <tr className="bg-gray-900">
                  {selectedTable.fields.map((field,index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-300"
                    >
                      {field.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData(selectedTable.data).map((row, index) => (
                  <tr key={uuidv4()} className="border-t border-gray-700">
                  {selectedTable.fields.map((field) => (
                    <td key={field.name} className="px-4 py-3 text-sm text-gray-300">
                      <EditableCell
                        field={field}
                        value={editingRow === row.id ? editedData[field.name] : row[field.name]}
                        isEditing={editingRow === row.id}
                        onChange={(value) => handleCellChange(field.name, value)}
                      />
                    </td>
                    ))}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        {editingRow === row.id ? (
                          <>
                            <button
                              onClick={() => handleSave(row)}
                              className="p-1 text-green-400 hover:text-green-300"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRow(null);
                                setEditedData({});
                              }}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(row)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                  </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-auto border-t border-gray-700">
                <div className="px-4 py-3 bg-gray-900 flex items-center justify-between rounded-b-lg">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${
                        currentPage === 1
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${
                        currentPage === totalPages
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, selectedTable.data.length)} of {selectedTable.data.length} records
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Row"
        message="Are you sure you want to delete this row? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setRowToDelete(null);
        }}
      />

      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}
    </div>
  );
};