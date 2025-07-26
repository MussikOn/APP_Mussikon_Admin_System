// Lee el archivo START.md y continúa con el desarrollo del proyecto
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
