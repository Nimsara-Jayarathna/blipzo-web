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
    <form className="flex flex-col gap-5 sm:gap-6" onSubmit={onSubmit}>
      <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-sm text-[var(--page-fg)] shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] backdrop-blur-md transition hover:border-accent/40 hover:text-accent"
          >
            ← Back
          </button>
          <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1.5 backdrop-blur-md">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</span>
            <span className="text-sm font-semibold text-[var(--page-fg)]">{currencySymbol} {amount || '0.00'}</span>
          </span>
        </div>
        <div className="inline-flex rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] shadow-soft backdrop-blur-md w-full sm:w-auto">
          {(['income', 'expense'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onChangeType(option)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition first:rounded-l-full last:rounded-r-full ${transactionType === option
                ? option === 'income'
                  ? 'bg-income text-white'
                  : 'bg-expense text-white'
                : 'text-[var(--text-muted)] hover:bg-accent/5'
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
          className={`rounded-2xl border px-4 py-3 text-sm text-[var(--page-fg)] focus:outline-none focus:ring-2 ${isToday
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
          className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70 sm:py-2 sm:text-sm"
        disabled={isSubmitting || isLoadingCategories || !filteredCategories.length}
      >
        {isSubmitting ? <span>Saving...</span> : <span>Add Transaction</span>}
      </button>
    </form>
  )
}

