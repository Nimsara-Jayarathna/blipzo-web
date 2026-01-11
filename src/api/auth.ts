import { apiClient } from './client'
import type { AuthCredentials, AuthResponse, SessionResponse } from '../types'

// --- Login / Session ---

export const login = async (credentials: AuthCredentials) => {
  const { data } = await apiClient.post<AuthResponse>('/api/v1.1/auth/login', credentials)
  return data
}

export const getSession = async () => {
  const { data } = await apiClient.get<SessionResponse>('/api/v1.1/auth/session')
  return data
}

export const refreshSession = async () => {
  const { data } = await apiClient.post<AuthResponse>('/api/v1.1/auth/refresh')
  return data
}

export const logoutSession = async () => {
  await apiClient.post('/api/v1.1/auth/logout')
}

// --- Registration Wizard ---

export const registerInit = async (email: string) => {
  const { data } = await apiClient.post('/api/v1.1/auth/register/init', { email })
  return data
}

export const registerVerify = async (email: string, otp: string) => {
  const { data } = await apiClient.post<{ registrationToken: string }>('/api/v1.1/auth/register/verify', { email, otp })
  return data
}

export const registerComplete = async (token: string, details: Partial<AuthCredentials> & { fname: string; lname: string }) => {
  const { data } = await apiClient.post<AuthResponse>('/api/v1.1/auth/register/complete', {
    registrationToken: token,
    ...details,
  })
  return data
}

/**
 * @deprecated Legacy single-step register, kept just in case, but unused in v1.1 flow
 */
export const register = async (credentials: AuthCredentials) => {
  const { data } = await apiClient.post<AuthResponse>('/api/v1.1/auth/register', credentials)
  return data
}

// --- Password Reset ---

export const passwordForgot = async (email: string) => {
  // Always returns success status for security
  const { data } = await apiClient.post('/api/v1.1/auth/password/forgot', { email })
  return data
}

export const passwordReset = async (token: string, password: string) => {
  const { data } = await apiClient.post('/api/v1.1/auth/password/reset', { token, password })
  return data
}

// --- Email Change ---

export const emailChangeInit = async () => {
  const { data } = await apiClient.post('/api/v1.1/auth/email/change/init')
  return data
}

export const emailChangeVerifyCurrent = async (otp: string) => {
  const { data } = await apiClient.post<{ changeToken: string }>('/api/v1.1/auth/email/change/verify-current', { otp })
  return data
}

export const emailChangeRequestNew = async (changeToken: string, newEmail: string) => {
  const { data } = await apiClient.post('/api/v1.1/auth/email/change/request-new', { changeToken, newEmail })
  return data
}

export const emailChangeConfirm = async (otp: string) => {
  const { data } = await apiClient.post<{ user: any }>('/api/v1.1/auth/email/change/confirm', { otp })
  return data
}

