import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';

// Maximum performance React render for development
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Optimized render strategy for better LCP
const renderApp = (): void => {
  const root = createRoot(rootElement);
  root.render(<App />);

  // In-place skeleton swap - replace skeleton buttons with real buttons
  requestAnimationFrame(() => {
    const skeletonButtons = document.querySelectorAll('.skeleton-button');
    skeletonButtons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });
  });
};

// Immediate render for better LCP - no delays
renderApp();
