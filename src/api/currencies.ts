import { apiClient, API_ENDPOINT_PREFIX } from './client'
import type { Currency } from '../types'

interface GetCurrenciesResponse {
    currencies: Currency[]
}

interface UpdateCurrencyResponse {
    currency: Currency
    message: string
}

export const getSupportedCurrencies = async () => {
    const { data } = await apiClient.get<GetCurrenciesResponse>(`${API_ENDPOINT_PREFIX}/currencies`)
    return data
}

export const updateUserCurrency = async (currencyId: string) => {
    const { data } = await apiClient.put<UpdateCurrencyResponse>(`${API_ENDPOINT_PREFIX}/users/currency`, {
        currencyId,
    })
    return data
}
