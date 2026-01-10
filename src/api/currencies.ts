import { apiClient } from './client'
import type { Currency } from '../types'

interface GetCurrenciesResponse {
    currencies: Currency[]
}

interface UpdateCurrencyResponse {
    currency: Currency
    message: string
}

export const getSupportedCurrencies = async () => {
    const { data } = await apiClient.get<GetCurrenciesResponse>('/api/v1.1/currencies')
    return data
}

export const updateUserCurrency = async (currencyId: string) => {
    const { data } = await apiClient.put<UpdateCurrencyResponse>('/api/v1.1/users/currency', {
        currencyId,
    })
    return data
}
