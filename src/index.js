import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import Index from './router/index/index';
import reportWebVitals from './reportWebVitals';
import Register from './router/register/register';
import Login from './router/login/login';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
        <Route path="/" index element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);


reportWebVitals();
