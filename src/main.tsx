
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupConnectionMonitoring } from './lib/supabase-monitor.ts'

// Initialize connection monitoring before rendering the app
setupConnectionMonitoring(30000);

// Create root and render app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);
