"use client"

import { useState } from "react"
import { AlertCircle } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { StandardTemplates } from "../components/standard-templates"
import { ScrollArea } from "../components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { TablesContainer } from "../components/tables-container"

interface AlertMessage {
  title: string;
  body: string;
}

interface Code {
  method: string;
  code: string;
}

export function PlusView() {
  const url = 'http://localhost:5000';
  const [showAlert, setShowAlert] = useState(false)
  const [code, setCode] = useState<Code>({
    code:'',
    method:'GET'
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    title:"", 
    body:""
  });

  const handleDeploy = async () => {

    try{
      console.log(code)
      const resp = await fetch(`${url}/deploy`, {
          method: 'POST', 
          headers: {
              'Content-Type':'application/json'
          },
          body: JSON.stringify({code:code.code,method:code.method})
      })
      const data = await resp.json();
      console.log("Response:", resp.ok)
      if(resp.ok){
          setAlertMessage({title:"Success!",body:data.message})
      }else{
          setAlertMessage({title:"Failure!",body:data.message})
          console.log(data);
      }
    } catch(e){
        console.log(e)
        setAlertMessage({title:"Failure!",body:"Can't create the endpoint, something went wrong..."})
    }
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 10000)
  }

  return (
    <div className="flex h-full">
      <div className="w-1/2 p-6 space-y-6 flex flex-col">
        {showAlert && (
          <Alert variant="default" className="bg-gray-800 border-gray-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{alertMessage.title}</AlertTitle>
            <AlertDescription>{alertMessage.body}</AlertDescription>
          </Alert>
        )}
        <div className="flex-grow flex flex-col bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex items-center p-2 bg-gray-700">
            <Select value={code.method} onValueChange={(value: string) => setCode(prev => ({...prev, method: value}))}>
              <SelectTrigger className="w-[100px] bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Method"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="flex-1">
            <Textarea
              placeholder="Enter your code or configuration here..."
              className="min-h-full w-full resize-none bg-transparent border-none text-gray-100 p-4 font-mono text-sm"
              value={code.code}
              onChange={(e)=>setCode(prev=>({...prev, code:e.target.value}))}
            />
          </ScrollArea>
          <div className="bg-gray-700 p-2">
            <Button
              onClick={handleDeploy}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Deploy
            </Button>
          </div>
        </div>
        <StandardTemplates />
      </div>
      <div className="w-1/2 border-l border-gray-700 overflow-hidden">
        <TablesContainer />
      </div>
    </div>
  )
}

