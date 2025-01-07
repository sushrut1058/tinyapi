import React from 'react';
import { X } from 'lucide-react';

interface EditorTab {
  id: string;
  title: string;
  content: string;
  isTemplate?: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
}) => {
  return (
    <div className="flex space-x-1 bg-gray-900 px-2 pt-2">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer ${
            activeTab === tab.id
              ? 'bg-gray-800 text-gray-200'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800/50'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="text-sm">{tab.title}</span>
          {tab.isTemplate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;