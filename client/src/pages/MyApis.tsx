import StatusMessage from '../components/feedback/StatusMessage';
import React, { useContext, useEffect, useState } from 'react';
import ApiList from '../components/profile/ApiList';
import { ApiDetails } from '../components/profile/ApiDetails';
import { ApiItem } from '../types/profile';
import ApiModal from '../components/profile/ApiModal';
import AuthContext from '../contexts/AuthContext';

const MyApisPage = () => {
  const [selectedApi, setSelectedApi] = useState(null);
  const [apiCode, setApiCode] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [method, setMethod] = useState('');
  const [apis, setApis] = useState<ApiItem[]|[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {accessToken} = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL //"http://localhost:5000"

  const handleApiEdit = async (api: ApiItem) => {
    setSelectedApi(api);
    try {
      console.log(api)
      const response = await fetch(`${url}/get/${api.endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setApiCode(data['message'].code);
        setSelectedApi((prev:any) => ({...prev, apiUrl: data['message'].api_url}))
        setIsModalOpen(true);
      } else{
        setStatus({ type: 'error', message: data['message'] });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to fetch API details. Please try again later' });
    }
  };

  const handleSave = async () => {
    if (!selectedApi) return;
    try {
      const response = await fetch(`${url}/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ code: apiCode, endpoint: selectedApi.endpoint })
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        fetchApis(); // Refresh the list
        setStatus({ type: 'success', message: data['message'] });
      } else {
        setStatus({ type: 'error', message: data['message'] });
      }
    } catch (error) {
      console.error('Failed to save API:', error);
      setStatus({ type: 'error', message: 'Failed to update API code' });
    }
  };

  const deleteApi = async () => {
    if (!selectedApi) return;

    try {
      const response = await fetch(`${url}/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          'endpoint': selectedApi.endpoint
        })
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        setSelectedApi(null);
        setStatus({ type: 'success', message: data['message'] });
        fetchApis();
      } else {
        setStatus({ type: 'error', message: data['message'] });
      }
    } catch (error) {
      console.error('Failed to delete API:', error);
      setStatus({ type: 'error', message: 'Failed to remove API.' });
    }
  };

  const fetchApis = async() => {
    try{
        const resp = await fetch(`${url}/get`, {
            'method':'GET',
            'headers':{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${accessToken}`
            }
        });
        const data = await resp.json()
      
        if(resp.status === 200){
            console.log(data);
            setApis(data);
        }else if(resp.status === 500) {
            console.log(data);
        }
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(()=>{
    fetchApis();
  },[])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-6">Deployed APIs</h2>
        <ApiList apis={apis} onEdit={handleApiEdit} />
      </div>
      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}
      <ApiModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApi(null);
        }}
        apiCode={apiCode}
        api={selectedApi}
        onSave={handleSave}
        onDelete={deleteApi}
        onCodeChange={(value) => setApiCode(value || '')}
      />
      
    </div>
  );
};

export default MyApisPage;