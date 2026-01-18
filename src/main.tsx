console.log('Main.tsx is executing...');
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store'

import { ErrorBoundary } from './components/ErrorBoundary';

import { WizardModeProvider } from './context/WizardModeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <WizardModeProvider>
          <App />
        </WizardModeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)

// Register PWA Service Worker
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, verify to reload.')
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline work.')
  },
})
