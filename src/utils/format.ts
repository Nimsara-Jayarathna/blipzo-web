import dayjs from 'dayjs'

export const formatCurrency = (value: number, currency = 'USD') => {
  // Try to find if the currency argument is actually a full currency code (e.g. from user profile)
  // If the user profile has a currency object, we expect the caller to pass the code (e.g. 'USD', 'EUR')
  // We use the code to format the number using Intl.NumberFormat

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    // Fallback if currency code is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value)
  }
}

export const formatDate = (value: string) => dayjs(value).format('MMM D, YYYY')

export const formatShortDate = (value: string) => dayjs(value).format('MMM D')
