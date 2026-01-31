import type { ChangeEvent } from 'react'
interface StepOneProps {
  amount: string
  onChangeAmount: (value: string) => void
  onSelectType: (type: 'income' | 'expense') => void
  currencySymbol: string
}

export const StepOne = ({ amount, onChangeAmount, onSelectType, currencySymbol }: StepOneProps) => {
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or digits with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      onChangeAmount(value)
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <label className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)] text-center sm:text-sm">
          Enter Amount
        </label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-light text-[var(--text-muted)] sm:left-6 sm:text-4xl">
            {currencySymbol}
          </span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="w-full rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] py-5 pl-12 pr-6 text-3xl font-light text-center text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:bg-[var(--surface-glass)] focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all sm:py-8 sm:pl-14 sm:pr-8 sm:text-5xl"
            autoFocus
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {(['income', 'expense'] as const).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectType(option)}
            className={`group relative flex items-center justify-between gap-3 overflow-hidden rounded-[1.75rem] border border-[var(--border-glass)] bg-[var(--surface-glass)] px-5 py-4 transition backdrop-blur-md sm:flex-col sm:justify-center sm:rounded-[2rem] sm:px-6 sm:py-6 ${option === 'income'
              ? 'hover:border-income/40 hover:bg-income/5'
              : 'hover:border-expense/40 hover:bg-expense/5'
              }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition group-hover:scale-110 sm:h-12 sm:w-12 ${option === 'income'
              ? 'border-income/30 bg-income/10 text-income'
              : 'border-expense/30 bg-expense/10 text-expense'
              }`}>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {option === 'income' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                )}
              </svg>
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest sm:text-sm ${option === 'income' ? 'text-income' : 'text-expense'
              }`}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
