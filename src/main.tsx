import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AgencyProvider } from './lib/AgencyContext';
import { AuthProvider } from './lib/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgencyProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AgencyProvider>
  </StrictMode>,
);
