import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/auth.context'
import axios from 'axios';

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;

// Set base URL for API requests if needed
// axios.defaults.baseURL = 'http://localhost:3000/api/v1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
