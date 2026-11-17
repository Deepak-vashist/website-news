import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { PrefsProvider } from './context/PrefsContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <PrefsProvider>
        <App />
      </PrefsProvider>
    </HashRouter>
  </StrictMode>,
)
