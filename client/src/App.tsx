import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateView from './pages/CreateView';
import Home from './pages/Home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateView />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
