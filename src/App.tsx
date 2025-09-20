import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Selection from './components/Selection';
import Photobooth from './components/Photobooth';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/photobooth" element={<Photobooth />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
