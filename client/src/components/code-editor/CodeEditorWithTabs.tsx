import React, { useState, useEffect, useRef } from 'react';
import Monaco from '@monaco-editor/react';
import ApiTemplates, { Template } from './ApiTemplates';
import EditorTabs from './EditorTabs';

interface CodeEditorWithTabsProps {
  value: string;
  bodyValue: string;
  onChange: (value: string) => void;
  onBodyChange: (value: string) => void;
}

interface Tab {
  id: string;
  title: string;
  content: string;
  isTemplate: boolean;
  body: string;
}

const CodeEditorWithTabs: React.FC<CodeEditorWithTabsProps> = ({ value, bodyValue, onChange, onBodyChange }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'main', title: 'api.py', content: value, body: bodyValue, isTemplate: false }
  ]);
  const [activeTab, setActiveTab] = useState('main');
  const [mainTabContent, setMainTabContent] = useState(value);
  
  const activeTabRef = useRef("main")

//   Keep main tab in sync with parent value
  useEffect(() => {    
    const mainTab = tabs.find(tab => tab.id === 'main');
    if (activeTab=='main' && mainTab && mainTab.content !== value) {
      setTabs(current => 
        current.map(tab => 
          tab.id === 'main' ? { ...tab, content: value } : tab
        )
      );
      localStorage.setItem('api_code',value);
    }
    if (activeTab=='main' && mainTab && mainTab.body !== bodyValue) {
      setTabs(current => 
        current.map(tab => 
          tab.id === 'main' ? { ...tab, body: bodyValue } : tab
        )
      );
    }
  }, [value, bodyValue]);

  useEffect(()=>{onChange(localStorage.getItem('api_code'))},[])

  const handleTemplateSelect = (template: Template) => {
    const existingTab = tabs.find(tab => tab.id === template.id);
    if (existingTab) {
      setActiveTab(template.id);
      onBodyChange(template.body);
    } else {
      const newTab: Tab = {
        id: template.id,
        title: template.name,
        content: template.code,
        isTemplate: true,
        body: template.body
      };
      setTabs(current => [...current, newTab]);
      setActiveTab(template.id);
      onBodyChange(template.body);
      // Ensure the correct tab is updated after setting the active tab
      handleEditorChange(template.code, template.id);
    }
  };

  const handleTabClose = (tabId: string) => {
    if (tabId === 'main') return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab('main');
      onBodyChange(activeBody);
    }
  };
  
  const handleEditorChange = (newValue: string | undefined, currentTab?: string) => {
    const content = newValue || '';
    let tabId;
    currentTab? tabId=currentTab: tabId=activeTab;

    setTabs(current =>
      current.map(tab =>
        tab.id === tabId ? { ...tab, content } : tab
      )
    );
    // onBodyChange(activeBody);
    if (activeTab === 'main') {
      onChange(content);
    }
  };

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content || '';

  const handleTabChange = (activeTab) => {
    setActiveTab(activeTab);
    const b = tabs.filter(item=>item.id==activeTab);
    console.log(activeTab, b[0])
    if(b.length){
      onBodyChange(b[0].body);
    }
  }

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      <EditorTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
      />
      
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <Monaco
            height="calc(100% - 40px)"
            defaultLanguage="python"
            theme="vs-dark"
            value={activeContent}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: activeTab !== 'main',
              automaticLayout: true,
            }}
          />
          
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900 border-t border-gray-800">
            <div className="p-2">
              <ApiTemplates onTemplateSelect={handleTemplateSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWithTabs;