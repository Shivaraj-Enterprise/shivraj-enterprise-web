import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { trackWhatsAppClicks, initGA } from './lib/gtm'

trackWhatsAppClicks();
initGA();

createRoot(document.getElementById("root")!).render(<App />);
