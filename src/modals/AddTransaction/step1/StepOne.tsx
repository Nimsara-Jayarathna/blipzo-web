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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest text-center">Enter Amount</label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-light text-[var(--text-muted)]">{currencySymbol}</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="w-full rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass)] py-8 pl-14 pr-8 text-5xl font-light text-center text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            autoFocus
          />
        </div>
      </div>

    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {(['income', 'expense'] as const).map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onSelectType(option)}
          className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass)] p-6 transition backdrop-blur-md ${option === 'income'
              ? 'hover:border-income/40 hover:bg-income/5'
              : 'hover:border-expense/40 hover:bg-expense/5'
            }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-110 ${option === 'income'
              ? 'border-income/30 bg-income/10 text-income'
              : 'border-expense/30 bg-expense/10 text-expense'
            }`}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {option === 'income' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              )}
            </svg>
          </div>
          <span className={`text-sm font-bold uppercase tracking-widest ${option === 'income' ? 'text-income' : 'text-expense'
            }`}>{option}</span>
        </button>
      ))}
    </div>
  </div>
  )
}
