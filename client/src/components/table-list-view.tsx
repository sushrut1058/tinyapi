"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

// Mock data for tables
const mockTables = [
  { 
    id: 1, 
    name: "Users", 
    schema: [
      { name: "id", type: "int" },
      { name: "name", type: "string" },
      { name: "email", type: "string" }
    ]
  },
  { 
    id: 2, 
    name: "Products", 
    schema: [
      { name: "id", type: "int" },
      { name: "name", type: "string" },
      { name: "price", type: "float" }
    ]
  },
  { 
    id: 3, 
    name: "Orders", 
    schema: [
      { name: "id", type: "int" },
      { name: "user_id", type: "int" },
      { name: "product_id", type: "int" },
      { name: "quantity", type: "int" }
    ]
  },
]

interface TableStruct {
  id: number|null;
  name: string|null;
  schema: any;
}

export function TableListView() {
  const url = "http://localhost:5000"
  const [selectedTable, setSelectedTable] = useState({id:0,name:"",schema:[{name:"",type:""}]});
  const [fetchedTables, setFetchedTables] = useState(null);
  const fetchTableList = async () => {
    try{
      const resp = await fetch(`${url}/tables/list`,{
        'method':'GET',
        'headers':{
          'Content-Type':'application/json'
        }
      });
      const data = await resp.json()
      
      if(resp.status === 200){
        console.log(data);
        const transformed_data = data['message'].map((item, index)=> ({...item, id: index+1}))
        console.log(transformed_data);
        setFetchedTables(transformed_data);
        // setSelectedTable(transformed_data[0]);
      }else if(resp.status === 500) {
        console.log(data);
      }
    } catch(e) {
      alert(e);
    }
  }

  useEffect(()=>{fetchTableList()},[])

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4">Tables</h2>
        <div className="space-y-2">
          {fetchedTables && fetchedTables.map((table) => (
            <Button
              key={table.id}
              variant={selectedTable.id === table.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTable(table)}
            >
              {table.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-lg font-semibold mb-4">Schema: {selectedTable.name}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Field Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.schema.map((field, index) => (
              <TableRow key={index}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

