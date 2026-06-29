import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMoon, faRightFromBracket, faSun } from '@fortawesome/free-solid-svg-icons'
import type { ThemeMode } from '../hooks/useTheme'

type NavbarVariant = 'landing' | 'dashboard'

interface AppNavbarProps {
  variant: NavbarVariant
  theme: ThemeMode
  onToggleTheme: () => void
  onLogin?: () => void
  onRegister?: () => void
  onOpenSettings?: () => void
  onLogout?: () => void
  userName?: string
}

export const AppNavbar = ({
  variant,
  theme,
  onToggleTheme,
  onLogin,
  onRegister,
  onOpenSettings,
  onLogout,
  userName,
}: AppNavbarProps) => {
  const isLanding = variant === 'landing'
  const headerClass = isLanding
    ? 'relative z-50'
    : 'sticky top-0 z-40 border-b border-[var(--border-glass)] bg-[var(--surface-glass)] backdrop-blur-md'
  const containerClass = `mx-auto flex max-w-7xl items-center justify-between gap-3 ${isLanding ? 'px-4 py-4 sm:px-8 sm:py-8' : 'px-4 py-3 sm:px-6 sm:py-4'
    }`
  const itemClass =
    'inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-2 text-sm font-medium text-[var(--page-fg)] backdrop-blur-md transition hover:border-accent/40 hover:text-accent'
  const themeButtonClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] text-[var(--page-fg)] shadow-sm backdrop-blur-md transition hover:border-accent/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40'
  const landingPrimaryClass =
    'rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] px-6 py-2 text-sm font-bold text-[var(--page-fg)] backdrop-blur-md transition hover:border-[#3498db] hover:text-[#3498db]'
  const iconClass = 'h-4 w-4 text-accent'
  const profileRef = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    if (!profileRef.current) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!profileRef.current || !target) return
      if (!profileRef.current.contains(target)) {
        profileRef.current.open = false
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [variant])

  return (
    <header className={headerClass}>
      <div className={containerClass}>
        <div className="text-2xl font-black tracking-tighter text-[var(--page-fg)]">
          Blipzo<span className="text-[#3498db]">.</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isLanding ? (
            <>
              <button
                type="button"
                onClick={onToggleTheme}
                className={themeButtonClass}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
              </button>
              <button type="button" onClick={onLogin} className={landingPrimaryClass}>
                Log in
              </button>
              <button
                type="button"
                onClick={onRegister}
                className="rounded-full bg-[#3498db] px-4 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-5px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9] sm:px-6 sm:py-2 sm:text-sm"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onToggleTheme}
                className={themeButtonClass}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
              </button>
              {userName ? (
                <details ref={profileRef} className="group relative">
                  <summary
                    className={`${itemClass} cursor-pointer list-none hover:border-[var(--border-glass)] hover:text-[var(--page-fg)]`}
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Hello</span>
                    <span className="font-semibold text-[var(--page-fg)]">{userName}</span>
                  </summary>
                  <div className="absolute right-0 top-full z-50 mt-3 w-48 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-2 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                    {onOpenSettings ? (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm text-[var(--page-fg)] transition hover:bg-[var(--surface-glass)]"
                        onClick={() => {
                          onOpenSettings()
                          if (profileRef.current) profileRef.current.open = false
                        }}
                      >
                        <FontAwesomeIcon icon={faGear} className={iconClass} />
                        Settings
                      </button>
                    ) : null}
                    {onLogout ? (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm text-[var(--page-fg)] transition hover:bg-[var(--surface-glass)]"
                        onClick={() => {
                          onLogout()
                          if (profileRef.current) profileRef.current.open = false
                        }}
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} className={iconClass} />
                        Logout
                      </button>
                    ) : null}
                  </div>
                </details>
              ) : null}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

