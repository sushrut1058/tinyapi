import { Sidebar } from "../components/sidebar"
import { PlusView } from "../components/plus-view"

import { TopBar } from "../components/top-bar"

export default function CreateView() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>
        <main className="flex-1 overflow-hidden">
          <PlusView />
        </main>
      </div>
    </div>
  )
}

