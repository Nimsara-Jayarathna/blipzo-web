import dayjs from 'dayjs'
import type { FormEvent } from 'react'
import { CategoryTiles } from './CategoryTiles'

interface StepTwoCategory {
  id: string
  name: string
  type: 'income' | 'expense'
  isDefault?: boolean
}

interface StepTwoProps {
  amount: string
  transactionType: 'income' | 'expense'
  date: string
  note: string
  categories: StepTwoCategory[]
  filteredCategories: StepTwoCategory[]
  selectedCategory: string
  isLoadingCategories: boolean
  isSubmitting: boolean
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onChangeType: (type: 'income' | 'expense') => void
  onChangeDate: (value: string) => void
  onChangeNote: (value: string) => void
  onSelectCategory: (id: string) => void
  currencySymbol: string
}

export const StepTwo = ({
  amount,
  transactionType,
  date,
  note,
  filteredCategories,
  selectedCategory,
  isLoadingCategories,
  isSubmitting,
  onBack,
  onSubmit,
  onChangeType,
  onChangeDate,
  onChangeNote,
  onSelectCategory,
  currencySymbol,
}: StepTwoProps) => {
  const isToday = date === dayjs().format('YYYY-MM-DD')

  return (
    <form className="flex flex-col gap-4 sm:gap-6" onSubmit={onSubmit}>
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Row 1: Back + Amount */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] text-[var(--text-muted)] transition hover:border-accent/40 hover:bg-[var(--surface-hover)] hover:text-[var(--page-fg)] active:scale-95 sm:h-10 sm:w-10"
            title="Go Back"
          >
            <span className="text-lg leading-none pb-0.5">←</span>
          </button>

          <div className="flex h-9 flex-1 items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 sm:h-10 sm:flex-none sm:px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-70">Amount</span>
            <span className="flex-1 text-right text-sm font-semibold text-[var(--page-fg)] sm:text-left">
              {currencySymbol} {amount || '0.00'}
            </span>
          </div>
        </div>

        {/* Row 2: Toggle (Full width on mobile, auto on desktop) */}
        <div className="flex h-9 w-full overflow-hidden rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 sm:h-10 sm:w-auto">
          {(['income', 'expense'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onChangeType(option)}
              className={`flex-1 sm:flex-none rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-all sm:px-6 sm:text-[10px] ${transactionType === option
                ? option === 'income'
                  ? 'bg-income text-white shadow-sm'
                  : 'bg-expense text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--page-fg)]'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-[var(--page-fg)]">Category</span>
        <CategoryTiles
          categories={filteredCategories}
          selectedCategoryId={selectedCategory}
          isLoading={isLoadingCategories}
          onSelectCategory={onSelectCategory}
        />
      </div>

      <label className="flex flex-col gap-2 text-sm text-[var(--page-fg)]">
        <span className="flex items-center gap-2">
          <span>Date</span>
          {isToday ? (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">Today</span>
          ) : null}
        </span>
        <input
          type="date"
          value={date}
          onChange={event => onChangeDate(event.target.value)}
          className={`rounded-2xl border px-3 py-2.5 text-sm text-[var(--page-fg)] focus:outline-none focus:ring-2 sm:px-4 sm:py-3 ${isToday
            ? 'border-accent bg-accent/5 focus:border-accent focus:ring-accent/40'
            : 'border-[var(--border-glass)] bg-[var(--surface-glass)] focus:border-accent focus:ring-accent/30'
            }`}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-[var(--page-fg)]">
        Note
        <textarea
          value={note}
          onChange={event => onChangeNote(event.target.value)}
          rows={3}
          placeholder="Optional note about this transaction"
          className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:px-4 sm:py-3"
        />
      </label>

      <button
        type="submit"
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70 sm:py-2 sm:text-sm"
        disabled={isSubmitting || isLoadingCategories || !filteredCategories.length}
      >
        {isSubmitting ? <span>Saving...</span> : <span>Add Transaction</span>}
      </button>
    </form>
  )
}

