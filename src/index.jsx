import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { AuthProvider } from './context/AuthContext.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

if (import.meta.env.APP_NODE_ENV === 'production') disableReactDevTools();

// Define the router using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
