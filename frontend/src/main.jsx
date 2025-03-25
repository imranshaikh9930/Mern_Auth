import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="249812084156-b3ufbd12fi35v6mkiqpr5uqpvm0n6nf3.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
)
