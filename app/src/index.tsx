import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
// import App from './App';
import {Home} from '../src/pages/home/index'
import {Equipe} from '../src/pages/equipe/index'
import {Servicos} from "../src/pages/servicos/index"
import {CustomNavbar} from "./components/navbar/index"
import {Login} from "./pages/login/index"
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/equipe" element={<Equipe />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <App /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
