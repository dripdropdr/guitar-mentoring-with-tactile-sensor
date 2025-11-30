import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SelectCode } from './pages/SelectCode';
import { Practice } from './pages/Practice';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-course" element={<SelectCode />} />
          <Route path="/practice/:chord" element={<Practice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
