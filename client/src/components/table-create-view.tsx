"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Trash2, AlertCircle } from 'lucide-react'

type Field = {
  name: string
  type: string
}

interface AlertMessage {
  title: string;
  body: string;
}

export function TableCreateView() {
  const url = "http://localhost:5000";
  const [tableName, setTableName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    title:"", 
    body:""
  });
  const [fields, setFields] = useState<Field[]>([{ name: "", type: "string" }]);

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }])
  }

  const updateField = (index: number, field: Partial<Field>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  }

  const createTable = async () => {
    try {
      const resp = await fetch(`${url}/tables/create`, {
          method: "POST",
          headers: {
              "Content-Type":"application/json"
          },
          body: JSON.stringify({"table_name": tableName,"table_columns":fields})
      });

      if(resp.status === 201){
        const data = await resp.json();
        console.log(data);
        setAlertMessage({title:'Success',body:`Table ${tableName} created successfully!`});
      }else if(resp.status === 400) {
        const data = await resp.json();
        console.log(data);
        setAlertMessage({title:'Failure',body:`Invalid data provided.`})
      }else if(resp.status === 500) {
        const data = await resp.json();
        console.log(data);
        setAlertMessage({title:'Failure', body:'An error has occurred, please try again later.'})
      }
    } catch(e) {
      setAlertMessage({title:'Something went wrong', body:'It\'s not you, it\'s us...'})
    }
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 10000)
    console.log("Creating table:", tableName, "with columns:", fields)
  }

  return (
    <div className="p-4 space-y-6">
      {showAlert && (
        <Alert variant="default" className="bg-gray-800 border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{alertMessage.title}</AlertTitle>
          <AlertDescription>{alertMessage.body}</AlertDescription>
        </Alert>
      )}
      <h2 className="text-lg font-semibold">Create New Table</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-gray-100"
          />
        </div>
        {fields.map((field, index) => (
          <div key={index} className="flex space-x-4">
            <div className="flex-grow">
              <Label htmlFor={`fieldName-${index}`}>Field Name</Label>
              <Input
                id={`fieldName-${index}`}
                value={field.name}
                onChange={(e) => updateField(index, { name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor={`fieldType-${index}`}>Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) => updateField(index, { type: value })}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fields.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeField(index)}
                className="self-end"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="space-x-4">
        <Button onClick={addField} variant="outline">Add Field</Button>
        <Button onClick={createTable} className="bg-blue-600 hover:bg-blue-700">Create Table</Button>
      </div>
    </div>
  )
}

