import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage/LandingPage'
import { StartForgotPassword } from './pages/LandingPage/StartForgotPassword'
import { ResetPassword } from './pages/LandingPage/ResetPassword'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { getSession } from './api/auth'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { setAuth, logout, isSessionChecked } = useAuth()

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getSession,
    enabled: !isSessionChecked,
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (sessionQuery.data?.user) {
      setAuth(sessionQuery.data)
    } else if (sessionQuery.isSuccess) {
      logout()
    }
  }, [logout, sessionQuery.data, sessionQuery.isSuccess, setAuth])

  useEffect(() => {
    if (sessionQuery.isError) {
      logout()
    }
  }, [logout, sessionQuery.isError])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans text-neutral antialiased">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forgot-password" element={<StartForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
