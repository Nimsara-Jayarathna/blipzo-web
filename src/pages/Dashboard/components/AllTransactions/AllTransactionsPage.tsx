import { useState } from 'react'
import type { AllTransactionsPageProps, Grouping, SortDirection, SortField } from './types'
import { Spinner } from '../../../../components/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { FiltersBar } from './FiltersBar'
import { SortControls } from './controls/SortControls'
import { DirectionControls } from './controls/DirectionControls'
import { GroupingControls } from './controls/GroupingControls'
import { TransactionTable } from './TransactionTable'
import { useAllTransactionsCategories } from './hooks/useAllTransactionsCategories'
import { useGroupedTransactions } from './hooks/useGroupedTransactions'

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

  const { categoriesForType } = useAllTransactionsCategories(filters, onFiltersChange)
  const filteredTransactions =
    filters.categoryFilter === 'all'
      ? transactions
      : transactions.filter(transaction => {
        const transactionCategoryId =
          transaction.categoryId ?? (typeof transaction.category === 'string' ? transaction.category : undefined)
        return transactionCategoryId === filters.categoryFilter
      })

  const grouped = useGroupedTransactions(filteredTransactions, grouping)

  return (
    <section className="space-y-4 rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-4 shadow-card backdrop-blur-xl sm:rounded-[34px] sm:p-8">
      <div className="space-y-3">
        <div className="relative z-50">
          <FiltersBar
            startDate={filters.startDate}
            endDate={filters.endDate}
            typeFilter={filters.typeFilter}
            categoryFilter={filters.categoryFilter}
            categories={categoriesForType}
            onChange={({ startDate, endDate, typeFilter, categoryFilter }) => {
              onFiltersChange({
                ...filters,
                startDate,
                endDate,
                typeFilter,
                categoryFilter,
              })
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
          <SortControls
            field={filters.sortField}
            onChange={(field: SortField) => onFiltersChange({ ...filters, sortField: field })}
          />
          <DirectionControls
            direction={filters.sortDirection}
            onChange={(direction: SortDirection) => onFiltersChange({ ...filters, sortDirection: direction })}
          />
          <GroupingControls grouping={grouping} onChange={setGrouping} />
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" centered />
      ) : transactions.length === 0 ? (
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
    </section>
  )
}
