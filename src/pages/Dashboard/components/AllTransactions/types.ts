import type { Transaction } from '../../../../types'

export type SortField = 'date' | 'amount' | 'category'
export type SortDirection = 'asc' | 'desc'
export type TransactionTypeFilter = 'all' | 'income' | 'expense'
export type Grouping = 'none' | 'month' | 'category'

export interface AllTransactionsFilters {
  startDate: string
  endDate: string
  typeFilter: TransactionTypeFilter
  categoryFilter: string
  sortField: SortField
  sortDirection: SortDirection
}

export interface AllTransactionsPageProps {
  transactions: Transaction[]
  isLoading?: boolean
  filters: AllTransactionsFilters
  onFiltersChange: (filters: AllTransactionsFilters) => void
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

export interface GroupedTransactions {
  label: string
  items: Transaction[]
}
