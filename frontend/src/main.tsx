import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Load global Tailwind design tokens & premium animations

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
