import type { Transaction } from '../../../../types'
import type { GroupedTransactions } from './types'
import { AllTransactionsTable } from './AllTransactionsTable'

interface TransactionTableProps {
  transactions: Transaction[]
  grouped?: GroupedTransactions[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
  hideCategory?: boolean
}

export const TransactionTable = ({ transactions, grouped, onDeleteTransaction, isDeleting, currency, hideCategory }: TransactionTableProps) => {
  return (
    <AllTransactionsTable
      transactions={transactions}
      grouped={grouped}
      onDeleteTransaction={onDeleteTransaction}
      isDeleting={isDeleting}
      currency={currency}
      hideCategory={hideCategory}
    />
  )
}
