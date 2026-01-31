import type { Transaction } from '../../../../types'
import { TodayActivitySection } from './activity/TodayActivitySection'

interface TodayTransactionsPageProps {
  transactions: Transaction[]
  isLoading?: boolean
  income: number
  expense: number
  balance: number
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

export const TodayTransactionsPage = ({
  transactions,
  isLoading = false,
  income,
  expense,
  balance,
  onDeleteTransaction,
  isDeleting,
  currency,
}: TodayTransactionsPageProps) => {
  return (
    <TodayActivitySection
      transactions={transactions}
      isLoading={isLoading}
      income={income}
      expense={expense}
      balance={balance}
      onDeleteTransaction={onDeleteTransaction}
      isDeleting={isDeleting}
      currency={currency}
    />
  )
}
