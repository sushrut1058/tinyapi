import React, { useState } from 'react';
import { Activity, List, Code } from 'lucide-react';
import ActivityTable from '../components/profile/ActivityTable';
import ApiList from '../components/profile/ApiList';
import {ApiDetails} from '../components/profile/ApiDetails';
import { dummyActivity, dummyApis } from '../data/dummyData';
import { ApiItem } from '../types/profile';

interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);
  const [apiCode, setApiCode] = useState('');

  const handleApiEdit = (api: ApiItem) => {
    setSelectedApi(api);
    setApiCode(api.code);
    setActiveTab('details');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex space-x-4">
        <Tab
          icon={<Activity className="w-5 h-5" />}
          label="Recent Activity"
          isActive={activeTab === 'activity'}
          onClick={() => setActiveTab('activity')}
        />
        <Tab
          icon={<List className="w-5 h-5" />}
          label="Deployed APIs"
          isActive={activeTab === 'apis'}
          onClick={() => setActiveTab('apis')}
        />
        <Tab
          icon={<Code className="w-5 h-5" />}
          label="API Details"
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
        />
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {activeTab === 'activity' && <ActivityTable activities={dummyActivity} />}
        {activeTab === 'apis' && <ApiList apis={dummyApis} onEdit={handleApiEdit} />}
        {activeTab === 'details' && selectedApi && (
          <ApiDetails
            apis={dummyApis}
            selectedApi={selectedApi}
            apiCode={apiCode}
            onApiSelect={(api) => {
              setSelectedApi(api);
              setApiCode(api.code);
            }}
            onCodeChange={setApiCode}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;