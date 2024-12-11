"use client"

import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

const tables = [
  { id: 1, name: 'Users', columns:['name', 'email'], data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]},
  { id: 2, name: 'Products', data: [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 599.99 },
  ]},
]

export function TableView() {
  const url = "http://localhost:5000";
  const [selectedTable, setSelectedTable] = useState(tables[0])
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
      }else if(resp.status === 500) {
        console.log(data);
      }
    } catch(e) {
      alert(e);
    }
  }

  const fetchTableData = async (table_name: string) => {
    try{
      const resp = await fetch(`${url}/tables/view/${table_name}`, {
        method:'GET',
        headers: {
          'Content-Type':'application/json'
        }
      });
      const data = await resp.json();
      if(resp.status===200){
        console.log(data);
        setSelectedTable(data['message']);
      }else if(resp.status!==500){
        console.log('failure');
      }
    }catch(e){
      console.log(e);
    }
      
  }

  useEffect(()=>{
    fetchTableList();
  },[])

  return (
    <div className="flex h-full bg-gray-800 rounded-lg">
      <div className="w-1/4 border-r border-gray-700 p-4">
        <h2 className="text-xl font-bold mb-4">Tables</h2>
        {fetchedTables && fetchedTables.map((table) => (
          <Button
            key={table.id}
            variant={selectedTable.id === table.id ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={()=>fetchTableData(table.name)}
          >
            {table.name}
          </Button>
        ))}
      </div>
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">{selectedTable.name}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              {selectedTable.columns.map((item, key) => (
                <TableHead key={key}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.data.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

