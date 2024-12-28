import React, { useState, useRef } from 'react';
import CodeEditor from '../components/CodeEditor';
import RequestPayload from '../components/RequestPayload';
import Terminal from '../components/terminal/Terminal';
import StatusMessage from '../components/feedback/StatusMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Play, Upload } from 'lucide-react';

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
  const [headers, setHeaders] = useState([{ id: 1, key: 'Content-Type', value: 'application/json' }]);
  const [queryParams, setQueryParams] = useState<{id:number, key: string, value:string}|[]>([]);
  const [pathParams, setPathParams] = useState<{id:number, key: string, value:string}[]|[]>([]);
  const [body, setBody] = useState(templateBodyRef.current);
  const [response, setResponse] = useState<string | null>(null);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stderr, setStderr] = useState<string | null>(null);
  const url = "http://localhost:5000"

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
          'Content-Type':'application/json'
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
          'Content-Type':'application/json'
        },
        body: JSON.stringify({body})
      })
      console.log(JSON.stringify({body}))
      const data = await resp.json();
      if(resp.ok){
        setStatus({
          type: 'success',
          text: data.message
        });
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
      code: code,
      method: method,
      api_data: {
        path_params: pathParamsArray,
        content_type: content_type
      }
    }
    return body
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pl-16">
      <div className="h-screen overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
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
              <div className="flex-1" />
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

            <div className="grid grid-cols-7 gap-6">
              <div className="col-span-5">
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="col-span-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>

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