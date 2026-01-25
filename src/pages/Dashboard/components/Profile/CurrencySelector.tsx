import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupportedCurrencies, updateUserCurrency } from '../../../../api/currencies'
import { useAuth } from '../../../../hooks/useAuth'
import { Spinner } from '../../../../components/Spinner'
import { useBlockingAsync } from '../../../../hooks/useBlockingAsync'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { Currency } from '../../../../types'

export const CurrencySelector = () => {
  const { user, setAuth } = useAuth()
  const queryClient = useQueryClient()
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: getSupportedCurrencies,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const {
    execute: executeUpdate,
    isLoading: isUpdating,
    modal: blockingModal,
  } = useBlockingAsync(updateUserCurrency, {
    successMessage: 'Currency updated successfully!',
    onSuccess: (data) => {
      if (user) {
        // Update local auth state immediately
        setAuth({
          user: {
            ...user,
            currency: data.currency,
          },
        })
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })


      setPendingCurrency(null)
    },
    onError: () => {
      setPendingCurrency(null)
    },
  })

  const handleSelect = (currency: Currency) => {
    if (user?.currency?._id === currency._id) return
    setPendingCurrency(currency._id)
    executeUpdate(currency._id)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" className="border-t-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {data?.currencies.map((currency) => {
          const isSelected = user?.currency?._id === currency._id || user?.currency?.code === currency.code
          const isPending = pendingCurrency === currency._id

          return (
            <button
              key={currency._id}
              onClick={() => handleSelect(currency)}
              disabled={isUpdating}
              className={`
                group relative flex items-center justify-between rounded-xl border p-4 transition-all
                ${isSelected
                  ? 'border-accent bg-accent/5 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]'
                  : 'border-[var(--border-glass)] bg-[var(--surface-glass)] hover:border-[var(--border-glass-strong)] hover:bg-[var(--surface-glass-thick)]'
                }
                ${isPending ? 'cursor-wait opacity-80' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${isSelected ? 'bg-accent text-white' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] group-hover:text-[var(--page-fg)]'
                    }`}
                >
                  {isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    currency.symbol
                  )}
                </span>
                <div className="text-left">
                  <div className={`font-medium ${isSelected ? 'text-accent' : 'text-[var(--page-fg)]'}`}>
                    {currency.code}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{currency.name}</div>
                </div>
              </div>

              {isSelected && !isPending && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      {blockingModal}
    </div>
  )
}
