import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './firebase';
import ErrorBoundary from './components/ErrorBoundary.tsx';

console.log("Main.tsx is running...");
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");
  
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log("React root rendered");
} catch (e) {
  console.error("Error in main.tsx:", e);
}
