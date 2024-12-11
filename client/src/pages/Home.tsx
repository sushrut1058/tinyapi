import { Sidebar } from "../components/sidebar"
import { PlusView } from "../components/plus-view"
import { TablesContainer } from "../components/tables-container"
import { TopBar } from "../components/top-bar"
import { HomeView } from "../components/home-view"

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <HomeView />
        </main>
      </div>
    </div>
  )
}

