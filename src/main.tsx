import { createRoot } from 'react-dom/client'
import App from './App'

// Import CSS directly for Vite to process it
import './styles/app.css'

// Performance-optimized React render
const rootElement = document.getElementById('root')!;
rootElement.innerHTML = ''; // Clear loading state instantly

// Use concurrent rendering for better performance
const root = createRoot(rootElement);
root.render(<App />);
