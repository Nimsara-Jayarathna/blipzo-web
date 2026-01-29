import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import type { AllTransactionsPageProps, Grouping, SortDirection, SortField, TransactionTypeFilter } from './types'
import { Spinner } from '../../../../components/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { TransactionTable } from './TransactionTable'
import { useAllTransactionsCategories } from './hooks/useAllTransactionsCategories'
import { useGroupedTransactions } from './hooks/useGroupedTransactions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const typeOptions: { type: TransactionTypeFilter; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'income', label: 'Inc' },
  { type: 'expense', label: 'Exp' },
]

type DropdownOption = {
  value: string
  label: string
  tone?: 'income' | 'expense'
}

const SidebarDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const selected = options.find(option => option.value === value) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="mt-2 flex w-full items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs font-semibold text-[var(--page-fg)] shadow-sm backdrop-blur-md transition hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.tone ? (
            <span
              className={`h-2 w-2 rounded-full ${
                selected.tone === 'income' ? 'bg-income' : 'bg-expense'
              }`}
              aria-hidden="true"
            />
          ) : null}
          <span className="truncate">{selected?.label}</span>
        </span>
        <span className="text-[10px] text-[var(--text-subtle)]">{open ? '▲' : '▼'}</span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-1)] shadow-[0_22px_50px_-24px_rgba(15,23,42,0.35)]">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold transition hover:bg-[var(--surface-2)] ${
                  value === option.value ? 'bg-accent/10 text-accent' : 'text-[var(--page-fg)]'
                }`}
              >
                {option.tone ? (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      option.tone === 'income' ? 'bg-income' : 'bg-expense'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const AllTransactionsPage = ({
  transactions,
  isLoading = false,
  filters,
  onFiltersChange,
  onDeleteTransaction,
  isDeleting,
  currency,
  onOpenSummary,
}: AllTransactionsPageProps) => {
  const [grouping, setGrouping] = useState<Grouping>('none')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { categoriesForType } = useAllTransactionsCategories(filters, onFiltersChange)

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return transactions
    return transactions.filter((transaction) => {
      const categoryLabel =
        typeof transaction.category === 'string'
          ? transaction.category || transaction.categoryName || transaction.title || 'Transaction'
          : transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
      const haystack = [
        categoryLabel,
        transaction.title,
        transaction.categoryName,
        transaction.note,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [transactions, searchTerm])

  const grouped = useGroupedTransactions(filteredTransactions, grouping)

  const categoryOptions: DropdownOption[] = [
    { value: 'all', label: 'All categories' },
    ...categoriesForType.map(category => ({
      value: category.id,
      label: category.name,
      tone: category.type,
    })),
  ]

  const sortOptions: DropdownOption[] = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
  ]

  const directionOptions: DropdownOption[] = [
    { value: 'desc', label: 'Descending ↓' },
    { value: 'asc', label: 'Ascending ↑' },
  ]

  const groupingOptions: DropdownOption[] = [
    { value: 'none', label: 'None' },
    { value: 'month', label: 'Month' },
    { value: 'category', label: 'Category' },
  ]

  const handleResetFilters = () => {
    setSearchTerm('')
    setGrouping('none')
    onFiltersChange({
      ...filters,
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      typeFilter: 'all',
      categoryFilter: 'all',
      sortField: 'date',
      sortDirection: 'desc',
    })
  }

  const typeLabel =
    filters.typeFilter === 'all'
      ? 'All'
      : filters.typeFilter === 'income'
        ? 'Income'
        : 'Expense'
  const categoryLabel =
    categoryOptions.find(option => option.value === filters.categoryFilter)?.label ?? 'All categories'
  const sortLabel = sortOptions.find(option => option.value === filters.sortField)?.label ?? 'Date'
  const directionLabel = filters.sortDirection === 'asc' ? 'Asc ↑' : 'Desc ↓'
  const groupLabel = groupingOptions.find(option => option.value === grouping)?.label ?? 'None'
  const rangeLabel = `${dayjs(filters.startDate).format('MMM D')}–${dayjs(filters.endDate).format('MMM D')}`

  const filterContent = (
    <div className="mt-3 space-y-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Date Range
        </p>
        <div className="mt-2 space-y-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onFiltersChange({ ...filters, startDate: event.target.value })}
            className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onFiltersChange({ ...filters, endDate: event.target.value })}
            className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Type
        </p>
        <div className="mt-2 inline-flex w-full items-center justify-between rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1">
          {typeOptions.map((option) => {
            const isActive = filters.typeFilter === option.type
            return (
              <button
                key={option.type}
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, typeFilter: option.type, categoryFilter: 'all' })
                }
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  isActive
                    ? 'bg-accent text-white shadow-[0_10px_25px_-18px_rgba(59,130,246,0.8)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--page-fg)]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <SidebarDropdown
          label="Category"
          value={filters.categoryFilter}
          options={categoryOptions}
          onChange={(categoryFilter) => onFiltersChange({ ...filters, categoryFilter })}
        />
        <SidebarDropdown
          label="Sort By"
          value={filters.sortField}
          options={sortOptions}
          onChange={(sortField) => onFiltersChange({ ...filters, sortField: sortField as SortField })}
        />
        <SidebarDropdown
          label="Direction"
          value={filters.sortDirection}
          options={directionOptions}
          onChange={(sortDirection) =>
            onFiltersChange({ ...filters, sortDirection: sortDirection as SortDirection })
          }
        />
        <SidebarDropdown
          label="Group By"
          value={grouping}
          options={groupingOptions}
          onChange={(value) => setGrouping(value as Grouping)}
        />
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--page-fg)]"
        >
          Reset Filters
        </button>
        {onOpenSummary ? (
          <button
            type="button"
            onClick={onOpenSummary}
            className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--page-fg)]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faChartPie} />
              Summary
            </span>
          </button>
        ) : null}
      </div>
    </div>
  )

  return (
    <section className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_3fr] md:gap-6">
      <div className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 shadow-soft backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(prev => !prev)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--text-subtle)]">
              Filters
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border-glass)] px-2 py-1">
                {rangeLabel}
              </span>
              <span className="rounded-full border border-[var(--border-glass)] px-2 py-1">
                {typeLabel}
              </span>
              <span className="rounded-full border border-[var(--border-glass)] px-2 py-1">
                {categoryLabel}
              </span>
              <span className="rounded-full border border-[var(--border-glass)] px-2 py-1">
                {sortLabel} · {directionLabel}
              </span>
              <span className="rounded-full border border-[var(--border-glass)] px-2 py-1">
                Group: {groupLabel}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-[var(--text-subtle)]">
            {mobileFiltersOpen ? 'Hide' : 'Edit'}
          </span>
        </button>
        {mobileFiltersOpen ? (
          <>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-sm text-[var(--page-fg)]">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--text-muted)]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search transactions"
                className="w-full bg-transparent text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>
            {filterContent}
          </>
        ) : null}
      </div>

      <aside className="hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 shadow-soft backdrop-blur-xl md:block md:sticky md:top-24 md:self-start">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-sm text-[var(--page-fg)]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--text-muted)]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search transactions"
            className="w-full bg-transparent text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
        {filterContent}
      </aside>

      <div className="min-w-0">
        {isLoading ? (
          <Spinner size="lg" centered />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState title="No transactions found" description="Adjust filters or add a transaction to see it here." />
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            grouped={grouped ?? undefined}
            onDeleteTransaction={onDeleteTransaction}
            isDeleting={isDeleting}
            currency={currency}
            hideCategory={grouping === 'category'}
          />
        )}
      </div>
    </section>
  )
}
