import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import UserContext from './context/UserContext.jsx';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <UserContext>
      <App />
    </UserContext>
  </StrictMode>
);
