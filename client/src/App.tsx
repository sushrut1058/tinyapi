import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import {ViewTables} from './pages/tables/ViewTables';
import {CreateTablePage} from './pages/tables/CreateTablePage';
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
              <Route path="/tables/create" element={<PrivateRoute><CreateTablePage /></PrivateRoute>} />
              <Route path="/user/apis" element={<PrivateRoute><MyApisPage /></PrivateRoute>} />
            </Routes>
    </Router>
  );
}

export default App;