import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/liquid-glass.css'
import IntroProvider from './components/intro/IntroProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IntroProvider>
      <App />
    </IntroProvider>
  </StrictMode>,
)
