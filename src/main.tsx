import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Maximum performance React render for development
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Use light mode for better contrast
// document.documentElement.classList.add('dark');

// Render the React app
const renderApp = (): void => {
  const root = createRoot(rootElement);
  root.render(<App />);
};

// Immediate render for better LCP - no delays
renderApp();
