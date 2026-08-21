import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './auth/RequireAuth'
import { AuthPage } from './components/auth/AuthPage'
import { LandingPage } from './components/landing/LandingPage'
import { AppShell } from './layouts/AppShell'
import { AutomationsPage } from './pages/AutomationsPage'
import { ChatPage } from './pages/ChatPage'
import { ProfilePage } from './pages/ProfilePage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="chat" replace />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="automations" element={<AutomationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
