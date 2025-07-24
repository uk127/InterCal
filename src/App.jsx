import { useState } from 'react'
import Input_bar from './components/Input_bar'
import './App.css'
import ButtonEg from './components/ButtonEg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Submit from './components/Submit';
import Sidebar from './components/Sidebar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Details from './components/Details';
import About from './components/About';
import Scrollbar from './components/Scrollbar'
import Settings from './components/Settings';
import { AuthProvider } from './AuthContext';
import Iconeg from "./components/Iconeg";
import PrintingPreview from './components/PrintingPreview';
function App() {

  return (
      <AuthProvider>
      <BrowserRouter>
      <Sidebar/>
        {/* <Scrollbar/> */}
        <Routes>
          <Route path='/' element={<Input_bar/>}/>
          <Route path='/submit' element={<Submit/>}/>
          <Route path='/signup' element={<Signup/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/details" element={<Details/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/settings" element={<Settings/>}  />
          <Route path="/printingpreview" element={<PrintingPreview/>} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
