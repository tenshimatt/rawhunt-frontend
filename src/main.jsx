import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import { PawsProvider } from './contexts/PawsContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
// Temporarily disable Auth0 to fix authentication conflicts
// import Auth0ProviderWrapper from './contexts/Auth0Provider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Auth0ProviderWrapper> */}
      <AuthProvider>
        <PawsProvider>
          <AppRouter />
        </PawsProvider>
      </AuthProvider>
    {/* </Auth0ProviderWrapper> */}
  </StrictMode>,
)
