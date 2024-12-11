import { Home, Plus } from 'lucide-react'
import {Link} from "react-router-dom"

export function Sidebar() {
  return (
    <aside className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      <Link to="/" className="text-gray-300 hover:text-white">
        <Home className="w-6 h-6" />
      </Link>
      <Link to="/create" className="text-gray-300 hover:text-white">
        <Plus className="w-6 h-6" />
      </Link>
    </aside>
  )
}

