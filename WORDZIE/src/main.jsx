import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App.jsx'; 
import AppNavbar from './components/AppNavbar.jsx';
import './index.css'; 
import './app-brand.css';
import './light-theme.css';

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(

  <React.StrictMode>
    <div className="app-frame">
      <AppNavbar />
      <App />
    </div>
  </React.StrictMode>,
);
