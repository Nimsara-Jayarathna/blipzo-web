import { create } from 'zustand'
import type { AuthResponse, UserProfile } from '../types'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isSessionChecked: boolean
  setAuth: (payload: AuthResponse) => void
  markSessionChecked: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isSessionChecked: false,
  setAuth: ({ user, token }: AuthResponse) =>
    set(state => ({
      user,
      token: token || state.token, // Keep existing token if not provided (e.g. profile update)
      isAuthenticated: true,
      isSessionChecked: true,
    })),
  markSessionChecked: () =>
    set(state => ({
      ...state,
      isSessionChecked: true,
    })),
  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isSessionChecked: true,
    }),
}))
