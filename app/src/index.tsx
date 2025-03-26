import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
// import App from './App';
import { CustomNavbar } from "./components/navbar/index";
import { Servicos } from "./pages/servicos/servicos";
// import { Login } from "./pages/login/login";
import { Equipe } from "./pages/equipe/equipe";
import { Home } from "./pages/home/home";

import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
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
