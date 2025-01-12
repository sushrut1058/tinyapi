import React, { useContext } from 'react';
import { LogOut, Code2 } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { logout } = useContext(AuthContext);
  const onLogout = () => {
    logout();
    window.location.href = "/"
  }
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 fixed top-0 right-0 left-16 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-semibold text-gray-100">tinyapi.xyz</span>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;