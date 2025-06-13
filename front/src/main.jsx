import React, { StrictMode } from 'react'; 
import ReactDOM from 'react-dom/client';   
import './index.css';                     
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);