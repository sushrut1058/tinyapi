import React from 'react';
import { Home, List, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="w-16 bg-gray-900 h-screen fixed left-0 top-0 flex flex-col items-center py-4">
      <Link 
        to="/"
        className={`p-3 rounded-lg mb-2 transition-colors ${
          isActive('/') ? 'bg-blue-600' : 'hover:bg-gray-800'
        }`}
      >
        <Home className="w-6 h-6 text-gray-300" />
      </Link>
      <Link 
        to="/tables"
        className={`p-3 rounded-lg mb-2 transition-colors ${
          isActive('/tables') ? 'bg-blue-600' : 'hover:bg-gray-800'
        }`}
      >
        <Database className="w-6 h-6 text-gray-300" />
      </Link>
      <Link 
        to="/myapis"
        className={`p-3 rounded-lg transition-colors ${
          isActive('/myapis') ? 'bg-blue-600' : 'hover:bg-gray-800'
        }`}
      >
        <List className="w-6 h-6 text-gray-300" />
      </Link>
    </div>
  );
};

export default Sidebar;