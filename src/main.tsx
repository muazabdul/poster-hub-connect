
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupConnectionMonitoring } from './lib/supabase-monitor.ts'

// Initialize the connection monitoring before rendering the app
setupConnectionMonitoring(30000);

createRoot(document.getElementById("root")!).render(<App />);
