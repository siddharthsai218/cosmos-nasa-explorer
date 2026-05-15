// ============================================================
// main.jsx — App entry point
//
// Renders the root App component into the #root div in index.html
// Imports global CSS (index.css) once here so it applies everywhere
// ============================================================

import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import './index.css';   // global styles, CSS variables, resets
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
