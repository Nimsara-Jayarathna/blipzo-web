import type { Transaction } from '../../../../../types'
import { LoadingSpinner } from '../../../../../components/LoadingSpinner'
import { TodaySummaryCards } from '../TodaySummaryCards'
import { TodayTransactionsTable } from '../TodayTransactionsTable'
import { EmptyState } from '../../ui/EmptyState'
import { ListHeader } from '../../Transactions/ListHeader'

interface TodayActivitySectionProps {
  transactions: Transaction[]
  isLoading?: boolean
  income: number
  expense: number
  balance: number
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

export const TodayActivitySection = ({
  transactions,
  isLoading = false,
  income,
  expense,
  balance,
  onDeleteTransaction,
  isDeleting,
  currency,
}: TodayActivitySectionProps) => {
  return (
    <div className="space-y-6">
      <TodaySummaryCards income={income} expense={expense} balance={balance} currency={currency} />
      <section className="rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-4 shadow-card backdrop-blur-xl sm:rounded-[34px] sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <ListHeader title="Today's Activity" />
          <div className="sm:hidden">
            {/* Mobile specific header actions if needed */}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : transactions && transactions.length ? (
          <TodayTransactionsTable
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
            isDeleting={isDeleting}
            currency={currency}
          />
        ) : (
          <EmptyState
            title="No activity today"
            description="Add a transaction to see it reflected in today's activity."
          />
        )}
      </section>
    </div>
  )
}
