import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Debe coincidir con el nombre y extensión del archivo real

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);