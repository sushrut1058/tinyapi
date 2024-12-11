import { Settings, LogOut } from 'lucide-react'
import { Button } from "../components/ui/button"

export function TopBar() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
      <div className="text-xl font-bold">TinyAPI</div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  )
}

