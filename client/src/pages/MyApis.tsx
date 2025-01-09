import React, { useEffect, useState } from 'react';
import ApiList from '../components/profile/ApiList';
import { ApiDetails } from '../components/profile/ApiDetails';
import { ApiItem } from '../types/profile';

const MyApisPage = () => {
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);
  const [apiCode, setApiCode] = useState('');
  const [apis, setApis] = useState<ApiItem[]|[]>([])
  const url = import.meta.env.VITE_API_URL //"http://localhost:5000"

  const handleApiEdit = (api: ApiItem) => {
    setSelectedApi(api);
    // setApiCode(api.code);
  };

  const fetchApis = async() => {
    try{
        const resp = await fetch(`${url}/list`, {
            'method':'GET',
            'headers':{
                'Content-Type':'application/json'
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
        {!selectedApi ? (
          <>
            <h2 className="text-xl font-semibold text-gray-200 mb-6">API List</h2>
            <ApiList apis={apis} onEdit={handleApiEdit} />
          </>
        ) : (
          <ApiDetails
            apis={apis}
            selectedApi={selectedApi}
            apiCode={apiCode}
            onApiSelect={(api) => {
              setSelectedApi(api);
              setApiCode('');
            }}
            onCodeChange={setApiCode}
          />
        )}
      </div>
    </div>
  );
};

export default MyApisPage;