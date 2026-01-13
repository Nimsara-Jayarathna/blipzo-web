import { apiClient, API_ENDPOINT_PREFIX } from './client'
import type { UserProfile } from '../types'

interface UpdateProfilePayload {
    fname?: string
    lname?: string
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.put<{ user: UserProfile, message: string }>(
        `${API_ENDPOINT_PREFIX}/auth/me`,
        payload
    )
    return data
}
