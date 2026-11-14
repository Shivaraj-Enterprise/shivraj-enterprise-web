import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { trackWhatsAppClicks } from './lib/gtm'

trackWhatsAppClicks();

createRoot(document.getElementById("root")!).render(<App />);
