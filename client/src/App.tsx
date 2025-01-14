import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import {ViewTables} from './pages/tables/ViewTables';
import CreateTable from './components/tables/CreateTable';
import MyApisPage from './pages/MyApis';
import Landing from './pages/Landing';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/tables/view" element={<PrivateRoute><ViewTables /></PrivateRoute>} />
              <Route path="/tables/create" element={<PrivateRoute><CreateTable /></PrivateRoute>} />
              <Route path="/user/apis" element={<PrivateRoute><MyApisPage /></PrivateRoute>} />
            </Routes>
    </Router>
  );
}

export default App;