import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Dashboard from './components/Home/Dashboard';
import Diagnostics from './components/Diagnostics/Diagnostics';
import SignIn from './components/Sign/SignIn';
import Register from './components/Sign/Register';
import Maintenance from './components/Maintenance/Maintenance';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/diagnostics" element={<Diagnostics />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/maintenance" element={<Maintenance />} />
    </Routes>
  </Router>
);

export default App;
