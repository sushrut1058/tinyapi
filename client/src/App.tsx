import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TablesView from './components/tables/TablesView';
import MyApisPage from './pages/MyApis';
import Landing from './pages/Landing';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/tables" element={<PrivateRoute><TablesView /></PrivateRoute>} />
              <Route path="/myapis" element={<PrivateRoute><MyApisPage /></PrivateRoute>} />
            </Routes>
    </Router>
  );
}

export default App;