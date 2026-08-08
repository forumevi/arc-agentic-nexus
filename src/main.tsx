import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { patchPropertyRedefinitionProtection } from './utils/ethereumProvider.ts';

// Patch browser extension property redefinition errors before rendering
patchPropertyRedefinitionProtection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

