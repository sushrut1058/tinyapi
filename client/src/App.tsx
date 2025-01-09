import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TablesView from './components/tables/TablesView';
import MyApisPage from './pages/MyApis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <Header />
        <main className="pt-16 pl-16">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tables" element={<TablesView />} />
              <Route path="/myapis" element={<MyApisPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;