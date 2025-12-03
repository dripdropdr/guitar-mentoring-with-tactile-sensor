import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice/:chord" element={<Practice />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
