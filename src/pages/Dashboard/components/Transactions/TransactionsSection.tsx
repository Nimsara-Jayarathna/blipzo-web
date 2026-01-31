import type { Transaction } from '../../../../types'
import { TransactionList } from '../TransactionList'
import { Spinner } from '../../../../components/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { ListHeader } from './ListHeader'

interface TransactionsSectionProps {
  title: string
  transactions: Transaction[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TransactionsSection = ({
  title,
  transactions,
  isLoading = false,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Log your first income or expense to unlock insights.',
  onDeleteTransaction,
  isDeleting,
}: TransactionsSectionProps) => {
  return (
    <section className="rounded-4xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-6 shadow-card backdrop-blur-xl">
      <ListHeader title={title} />

      {isLoading ? (
        <Spinner size="lg" centered />
      ) : transactions && transactions.length ? (
        <TransactionList
          transactions={transactions}
          title={title}
          onDeleteTransaction={onDeleteTransaction}
          isDeleting={isDeleting}
        />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </section>
  )
}
