import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate que la ruta y mayúsculas coinciden exactamente

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);