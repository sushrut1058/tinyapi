import React from 'react';
import { format } from 'date-fns';
import { ApiItem } from '../../types/profile';

interface ApiListProps {
  apis: ApiItem[];
  onEdit: (api: ApiItem) => void;
}

const ApiList: React.FC<ApiListProps> = ({ apis, onEdit }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-400 border-b border-gray-800">
          <th className="pb-3">Endpoint</th>
          <th className="pb-3">Method</th>
          <th className="pb-3">Hits</th>
          <th className="pb-3">Created</th>
          <th className="pb-3">Updated</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {apis.map((api, index) => (
          <tr key={index} className="border-b border-gray-800">
            <td className="py-4 text-gray-300">{api.endpoint}</td>
            <td className="py-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600/20 text-blue-400">
                {api.method}
              </span>
            </td>
            <td className="py-4 text-gray-300">{api.hits.toLocaleString()}</td>
            <td className="py-4 text-gray-400">
              {format(api.createdAt, 'MMM d, yyyy')}
            </td>
            <td className="py-4 text-gray-400">
              {format(api.updatedAt, 'MMM d, yyyy')}
            </td>
            <td className="py-4">
              <button
                onClick={() => onEdit(api)}
                className="text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApiList;