import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import AppLayout from './components/layout/AppLayout'
import SignInPage from './pages/SignInPage'
import Dashboard from './pages/Dashboard'
import RiskMapPage from './pages/RiskMapPage'
import RoutesPage from './pages/RoutesPage'
import IncidentsPage from './pages/IncidentsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

/** Every backend endpoint except sign-in requires a token, so the shell is gated. */
function AppRoutes() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <SignInPage />
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/risk-map" element={<RiskMapPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Anything unrecognised goes back to the dashboard. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
