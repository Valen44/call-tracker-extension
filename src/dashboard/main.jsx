import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';


import { Dashboard } from "./Dashboard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
)
