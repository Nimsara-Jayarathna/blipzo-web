import { useMemo, useState } from 'react'
import type { AllTransactionsPageProps, Grouping, SortDirection, SortField, TransactionTypeFilter } from './types'
import { Spinner } from '../../../../components/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { TransactionTable } from './TransactionTable'
import { useAllTransactionsCategories } from './hooks/useAllTransactionsCategories'
import { useGroupedTransactions } from './hooks/useGroupedTransactions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const typeOptions: { type: TransactionTypeFilter; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'income', label: 'Inc' },
  { type: 'expense', label: 'Exp' },
]

export const AllTransactionsPage = ({
  transactions,
  isLoading = false,
  filters,
  onFiltersChange,
  onDeleteTransaction,
  isDeleting,
  currency,
}: AllTransactionsPageProps) => {
  const [grouping, setGrouping] = useState<Grouping>('none')
  const [searchTerm, setSearchTerm] = useState('')

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

  return (
    <section className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_3fr] md:gap-6">
      <aside className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 shadow-soft backdrop-blur-xl md:sticky md:top-24 md:self-start">
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

        <div className="mt-4 space-y-4">
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
            <div className="mt-2 inline-flex w-full flex-col gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-2">
              {typeOptions.map((option) => {
                const isActive = filters.typeFilter === option.type
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() =>
                      onFiltersChange({ ...filters, typeFilter: option.type, categoryFilter: 'all' })
                    }
                    className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
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
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                Category
              </p>
              <select
                value={filters.categoryFilter}
                onChange={(event) => onFiltersChange({ ...filters, categoryFilter: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="all">All categories</option>
                {categoriesForType.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                Sort By
              </p>
              <select
                value={filters.sortField}
                onChange={(event) => onFiltersChange({ ...filters, sortField: event.target.value as SortField })}
                className="mt-2 w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                Direction
              </p>
              <select
                value={filters.sortDirection}
                onChange={(event) => onFiltersChange({ ...filters, sortDirection: event.target.value as SortDirection })}
                className="mt-2 w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                Group By
              </p>
              <select
                value={grouping}
                onChange={(event) => setGrouping(event.target.value as Grouping)}
                className="mt-2 w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="none">None</option>
                <option value="month">Month</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>
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
          />
        )}
      </div>
    </section>
  )
}
