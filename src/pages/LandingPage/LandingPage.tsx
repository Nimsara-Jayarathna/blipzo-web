import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import { login, register } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { useTheme } from '../../hooks/useTheme'
import type { AuthMode } from '../../types'
import { AppNavbar } from '../../layouts/AppNavbar'
import { Footer } from '../../components/Footer'
import { AuthModal } from './components/AuthModal'
import { DashboardPreview } from './components/DashboardPreview'
import { FeaturesSection } from './components/FeaturesSection'
import { HeroSection } from './components/HeroSection'

export const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setAuth, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<AuthMode | null>(null)

  // Clean initialization of token
  const [resetToken, setResetToken] = useState('')

  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', password: '' })


  const {
    execute: executeLogin,
    isLoading: isLoginLoading,
    modal: loginModal,
  } = useBlockingAsync(login, {
    successMessage: 'Welcome back!',
    onSuccess: data => {
      setAuth(data)
      navigate('/dashboard')
    },
  })

  const {
    execute: executeRegister,
    isLoading: isRegisterLoading,
    modal: registerModal,
  } = useBlockingAsync(register, {
    successMessage: 'Account created successfully!',
    onSuccess: data => {
      setAuth(data)
      navigate('/dashboard')
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Route-based mode handling
  useEffect(() => {
    if (location.pathname === '/reset-password') {
      const token = searchParams.get('token')
      if (token) {
        setResetToken(token)
        setMode('reset-password')
      } else {

        navigate('/')
      }
    } else if (location.pathname === '/forgot-password') {
      // Optional: if user navigates manually to /forgot-password
      setMode('forgot-password')
    }
  }, [location.pathname, searchParams, navigate])

  const transitionToMode = (nextMode: AuthMode) => {
    setMode(nextMode)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mode) return

    if (mode === 'login') {
      executeLogin({ email: formState.email, password: formState.password })
    } else if (mode === 'register') {
      // Logic handled inside AuthModal for multi-step now, but keeping safe fallback
      executeRegister({
        email: formState.email,
        password: formState.password,
        fname: formState.firstName,
        lname: formState.lastName,
      })
    }
  }

  const handleFieldChange = (field: 'firstName' | 'lastName' | 'email' | 'password', value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const isModalOpen = mode !== null
  const isLoading = isLoginLoading || isRegisterLoading

  return (
    <main
      data-theme={theme}
      className="relative min-h-screen w-full overflow-x-hidden bg-[var(--page-bg)] text-[var(--page-fg)]"
    >
      {loginModal}
      {registerModal}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-grid opacity-[0.03]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[var(--page-overlay-strong)] via-[var(--page-overlay-soft)] to-transparent" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#3498db]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#2ecc71]/10 blur-[120px]" />
      </div>

      <AppNavbar
        variant="landing"
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={() => transitionToMode('login')}
        onRegister={() => transitionToMode('register')}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-12 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <HeroSection onRegister={() => transitionToMode('register')} />
          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-[#3498db]/20 to-[#2ecc71]/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
            <div className="relative rounded-[2.5rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-4 shadow-2xl backdrop-blur-2xl">
              <DashboardPreview />
            </div>
          </div>
        </div>

        <FeaturesSection />
      </div>

      <AuthModal
        open={isModalOpen}
        mode={mode}
        isLoading={isLoading}
        onClose={() => { setMode(null); navigate('/') }} // Ensure we clear URL if on reset page
        onSubmit={handleSubmit}
        onModeChange={transitionToMode}
        formState={formState}
        onFieldChange={handleFieldChange}
        resetToken={resetToken}
      />
      <Footer />
    </main>
  )
}
