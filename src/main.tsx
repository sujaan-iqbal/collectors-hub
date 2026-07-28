import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from '@/context/ToastContext'
import { CollectionsProvider } from '@/context/CollectionsContext'
import { SocialProvider } from '@/context/SocialContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <SocialProvider>
          <CollectionsProvider>
            <App />
          </CollectionsProvider>
        </SocialProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
