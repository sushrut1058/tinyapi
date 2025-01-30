import React, { useState, useRef, useEffect, useContext } from 'react';
import CodeEditorWithTabs from '../components/code-editor/CodeEditorWithTabs';
import RequestPayload from '../components/RequestPayload';
import Terminal from '../components/terminal/Terminal';
import StatusMessage from '../components/feedback/StatusMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { TablesSidebar } from '../components/tables/TablesSidebar';
import { QuickTableView } from '../components/tables/QuickTableView';
import CreateTable from '../components/tables/CreateTable';
import { ViewToggle } from '../components/ViewToggle';
import { Play, Upload, X } from 'lucide-react';
import { Table } from '../types/tables';
import EndpointBanner from '../components/EndpointBanner';
import AuthContext from '../contexts/AuthContext';

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

const Home = () => {
  const templateCodeRef = useRef(`class API:
    def __init__(self, db):
        db.connect()
        table = db.load("dum")

    def handle(self, request):
        # Get user details
        return {"Response":{"message": "Hit!"},"Status":200}
  `)
  const templateBodyRef = useRef(`{
  "test":123
}`)

  const [method, setMethod] = useState('GET');
  const [code, setCode] = useState(templateCodeRef.current);
  const [apiName, setApiName] = useState('');
  const [headers, setHeaders] = useState([{ id: 1, key: 'Content-Type', value: 'application/json' }]);
  const [queryParams, setQueryParams] = useState<{id:number, key: string, value:string}[]|[]>([]);
  const [pathParams, setPathParams] = useState<{id:number, key: string, value:string}[]|[]>([]);
  const [body, setBody] = useState(templateBodyRef.current);
  const [response, setResponse] = useState<string | null>(null);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stderr, setStderr] = useState<string | null>(null);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentView, setCurrentView] = useState<'tables' | 'payload'>('payload');
  const [deployedEndpoint, setDeployedEndpoint] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [apiUrl, setApiUrl] = useState<string>("");
  
  const {accessToken, user} = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL //"http://localhost:5000"
  
  const createApiUrl = (queryParamsVar: {id:number, key: string, value:string}[]|[], pathParamsVar: {id:number, key: string, value:string}[]|[]) => {
    const qObj = queryParamsVar.filter(item => item.key!=="").reduce((accumulator, item, index) =>{
      return accumulator + `${index > 0 ? '&' : ''}${item.key}=[]`; 
    }, '')
    const pObj = pathParamsVar.filter(item => item.key!=='').reduce((accumulator, item, index) => {
      return accumulator + `${index > 0 ? '/' : ''}:${item.key}`;
    }, '')
    const finalPath = pObj + `${qObj==='' ? '' : '?'}${qObj}`;
    // setApiUrl(`/${finalPath}`);
    return '/'+finalPath;

  }

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
        const transformed_data = data['message'].map((item, index)=> ({...item, id: index+1}))
        console.log(transformed_data);
        setTables(transformed_data);
        // setSelectedTable(transformed_data[0]);
      }else if(resp.status === 500) {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
      // setError
    }
  }

  useEffect(()=>{
    if (currentView=="payload") return;
    fetchTableList();
  },[currentView])

  const prepareBody_test = () => {
    const headersObj = Object.fromEntries(headers.map(({ key, value }) => [key, value]));
    const queryParamsObj = Object.fromEntries(queryParams.map(({ key, value }) => [key, value]));

    const req_body = {
      code,
      payload: {
        query_params: queryParamsObj,
        path_params: pathParams,
        method,
        request: {
          headers: headersObj,
          body,
        },
      },
    };
    console.log(req_body);
    return req_body
  }

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const reqBody = prepareBody_test()
      const resp = await fetch(`${url}/test`, {
        method: "POST",
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`
        },
        body: JSON.stringify(reqBody)
      })
      const data = await resp.json();
      console.log("Response:", resp.ok)
      setResponse(JSON.stringify(data.response, null, 2));
      setStderr(JSON.stringify(data.errors, null, 2));
    } catch (err) {
      setStatus({
        type: 'error',
        text: 'Failed to test API. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = () => {
    if (!code.trim()) {
      setStatus({
        type: 'error',
        text: 'Please write some code before deploying'
      });
      return;
    }
    if (!apiName) {
      setStatus({
        type: 'error',
        text: 'Please assign a name to your API'
      });
      return;
    }
    setShowDeployConfirm(true);
  };

  const confirmDeploy = async () => {
    try {
      setIsLoading(true);
      setShowDeployConfirm(false);
      const body = prepareBody_deploy()
      console.log("body",body);
      const resp = await fetch(`${url}/deploy`, {
        method: "POST",
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({body})
      })
      console.log(JSON.stringify({body}))
      const data = await resp.json();
      if(resp.ok){
        setStatus({
          type: 'success',
          text: `Successfully deployed API ${apiName}`
        });
        setDeployedEndpoint(data.message);
      }else{
        setStatus({
          type: 'error',
          text: data.message
        });
      }      
    } catch (err) {
      setStatus({
        type: 'error',
        text: 'Failed to deploy API. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const prepareBody_deploy = () => {
    const contentTypeHeader = headers.filter((item) => item.key=='Content-Type');
    const content_type=contentTypeHeader.length!=0 ? contentTypeHeader[0].value :""
    const pathParamsArray = (pathParams.filter((item) => item.key!="")).map((item)=>item.key)

    const body = {
      api_name: apiName,
      code: code,
      method: method,
      api_data: {
        api_url: createApiUrl(queryParams, pathParams),
        path_params: pathParamsArray,
        content_type: content_type
      }
    }
    return body
  }

  const handleTemplateChange = (code: string, body: string) => {
    setCode(code);
    setBody(body);
  }
  

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pl-16">
      {deployedEndpoint && (
        <EndpointBanner 
          endpoint={deployedEndpoint}
          onClose={() => setDeployedEndpoint(null)}
        />
      )}
      <div className="h-screen overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-x-4">
              <input
                    type="text"
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                    placeholder="API Name *"
                    className="w-64 bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              </div>
              <div className="flex-1 mx-4">
                <div className="px-3 py-2 bg-gray-800 rounded-lg text-sm text-gray-400 font-mono">
                  {createApiUrl(queryParams, pathParams)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ViewToggle view={currentView} onViewChange={setCurrentView} />
                <button
                  onClick={handleTest}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{isLoading ? 'Testing...' : 'Test'}</span>
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-lg transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{isLoading ? 'Deploying...' : 'Deploy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-6">
              <div className="col-span-5">
                <CodeEditorWithTabs value={code} onChange={setCode} bodyValue={body} onBodyChange={setBody}/>
              </div>
              <div className="col-span-2 h-[calc(100vh-14rem)] overflow-y-auto">
                {currentView === 'tables' ? (
                  <>
                    <TablesSidebar
                      tables={tables}
                      onCreateTableClick={() => setShowCreateTable(true)}
                      onTableSelect={setSelectedTable}
                      selectedTable={selectedTable}
                    />
                    {selectedTable && <QuickTableView table={selectedTable} />}
                  </>
                ) : (
                  <RequestPayload
                    headers={headers}
                    queryParams={queryParams}
                    pathParams={pathParams}
                    body={body}
                    onHeadersChange={setHeaders}
                    onQueryParamsChange={setQueryParams}
                    onPathParamsChange={setPathParams}
                    onBodyChange={setBody}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCreateTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowCreateTable(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
            <CreateTable onClose={() => setShowCreateTable(false)} />
          </div>
        </div>
        )}
      <Terminal
        response={response}
        stderr={stderr}
        onClose={() => {
          setResponse(null);
          setStderr(null);
        }}
      />

      <ConfirmationDialog
        isOpen={showDeployConfirm}
        title="Deploy API"
        message="Are you sure you want to deploy this API?"
        onConfirm={confirmDeploy}
        onCancel={() => setShowDeployConfirm(false)}
      />

      {status && (
        <StatusMessage
          type={status.type}
          message={status.text}
          onClose={() => setStatus(null)}
        />
      )}
    </div>
  );
};

export default Home;
