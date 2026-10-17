import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Automatically register and activate PWA service worker with scope /
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('STUDSPOT PWA ServiceWorker active with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('STUDSPOT SW registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
