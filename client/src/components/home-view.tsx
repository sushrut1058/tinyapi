"use client"

import { useState } from 'react'
import { List, Database, Clock } from 'lucide-react'
import { Button } from "../components/ui/button"
import { ApiList } from "../components/api-list"
import { TableView } from "../components/table-view"
import { RecentActivity } from "../components/recent-activity"

type View = 'list' | 'tables' | 'recent'

export function HomeView() {
  const [activeView, setActiveView] = useState<View>('list')

  return (
    <div className="flex h-full">
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <Button
          variant={activeView === 'list' ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveView('list')}
        >
          <List className="h-6 w-6" />
        </Button>
        <Button
          variant={activeView === 'tables' ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveView('tables')}
        >
          <Database className="h-6 w-6" />
        </Button>
        <Button
          variant={activeView === 'recent' ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveView('recent')}
        >
          <Clock className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-1 p-6">
        {activeView === 'list' && <ApiList />}
        {activeView === 'tables' && <TableView />}
        {activeView === 'recent' && <RecentActivity />}
      </div>
    </div>
  )
}

