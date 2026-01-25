import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const resolveInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme())

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, setTheme, toggleTheme }
}
