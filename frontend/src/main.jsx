// ============================================
// main.jsx — THE ENTRY POINT
// ============================================
// This is the FIRST file that runs
// It connects React to the HTML file
//
// In index.html there is:
//   <div id="root"></div>
// This file finds that div and puts our
// entire React app inside it!
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // loads Tailwind CSS

ReactDOM.createRoot(
  // Find the <div id="root"> in index.html
  document.getElementById('root')
).render(
  // StrictMode helps catch bugs during development
  // It renders components TWICE in dev mode
  // to find side effects (doesn't happen in production)
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);