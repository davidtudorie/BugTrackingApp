import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MPDashboard from './components/MPDashboard';
import TSTDashboard from './components/TSTDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mp" element={<MPDashboard />} />
        <Route path="/tst" element={<TSTDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;