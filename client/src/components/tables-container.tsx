"use client"

import { useState } from "react"
import { List, PlusCircle } from 'lucide-react'
import { Button } from "../components/ui/button"
import { TableListView } from "../components/table-list-view"
import { TableCreateView } from "../components/table-create-view"

export function TablesContainer() {
  const [activeView, setActiveView] = useState<'list' | 'create'>('list')

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-start space-x-2 p-4 border-b border-gray-700">
        <Button
          variant={activeView === 'list' ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveView('list')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={activeView === 'create' ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveView('create')}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        {activeView === 'list' ? <TableListView /> : <TableCreateView />}
      </div>
    </div>
  )
}

