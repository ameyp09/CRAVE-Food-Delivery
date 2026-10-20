import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#020617',
              color: '#f8fafc',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              padding: '12px 18px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
            },
            success: {
              iconTheme: {
                primary: '#f97316',
                secondary: '#fff'
              }
            }
          }}
        />
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
