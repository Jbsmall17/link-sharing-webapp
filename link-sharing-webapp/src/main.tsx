import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router } from 'react-router-dom' 
import App from './App.tsx'
import './index.css'
import { ContextComp } from '../src/contextApi.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ContextComp>
        <App />
      </ContextComp>
    </Router>
  </StrictMode>,
)
