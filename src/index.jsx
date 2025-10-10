import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';

// Prevent automated reload and with that, data loss
window.addEventListener('beforeunload', (e) => { e.preventDefault(); });
window.addEventListener('unload', (e) => { e.preventDefault(); });

const base = import.meta.env.BASE_URL;
const basename = base.endsWith('/') && base.length > 1 
  ? base.slice(0, -1) 
  : base;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
