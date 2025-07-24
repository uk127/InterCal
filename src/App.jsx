import { useState } from 'react';
import Input_bar from './components/Input_bar';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Submit from './components/Submit';
import Sidebar from './components/Sidebar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Details from './components/Details';
import About from './components/About';
import Settings from './components/Settings';
import PrintingPreview from './components/PrintingPreview';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Input_bar />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/details" element={<Details />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/printingpreview" element={<PrintingPreview />} />
          {/* Fallback route for 404 */}
          <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '2rem' }}>404 - Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
