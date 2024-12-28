import React from 'react';
import { format } from 'date-fns';
import { ActivityItem } from '../../types/profile';

interface ActivityTableProps {
  activities: ActivityItem[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-400 border-b border-gray-800">
          <th className="pb-3">Endpoint</th>
          <th className="pb-3">Method</th>
          <th className="pb-3">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity, index) => (
          <tr key={index} className="border-b border-gray-800">
            <td className="py-4 text-gray-300">{activity.endpoint}</td>
            <td className="py-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600/20 text-blue-400">
                {activity.method}
              </span>
            </td>
            <td className="py-4 text-gray-400">
              {format(activity.timestamp, 'MMM d, yyyy HH:mm')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ActivityTable;