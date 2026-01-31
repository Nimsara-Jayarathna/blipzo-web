import type { Transaction } from '../../../../types'
import { TransactionTableHeader } from '../AllTransactions/table/TransactionTableHeader'
import { TransactionRow } from '../AllTransactions/table/TransactionRow'
import { TransactionCard } from '../AllTransactions/table/TransactionCard'

interface TodayTransactionsTableProps {
  transactions: Transaction[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

export const TodayTransactionsTable = ({
  transactions,
  onDeleteTransaction,
  isDeleting,
  currency,
}: TodayTransactionsTableProps) => {
  return (
    <>
      <div className="space-y-3 sm:hidden">
        {transactions.map(transaction => {
          const key =
            transaction._id ??
            transaction.id ??
            `${transaction.date}-${transaction.amount}-${transaction.category}`

          return (
            <TransactionCard
              key={key}
              transaction={transaction}
              onDeleteTransaction={onDeleteTransaction}
              isDeleting={isDeleting}
              currency={currency}
              forceDeletable
            />
          )
        })}
      </div>

      <div className="hidden sm:block -mx-4 overflow-x-auto sm:mx-0 sm:overflow-hidden sm:rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] shadow-soft backdrop-blur-xl">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full table-fixed text-left">
            <colgroup>
              <col className="w-[140px]" />
              <col className="w-[240px]" />
              <col className="w-[140px]" />
              <col />
              <col className="w-[56px]" />
            </colgroup>
            <TransactionTableHeader />
            <tbody>
              {transactions.map(transaction => {
                const key =
                  transaction._id ??
                  transaction.id ??
                  `${transaction.date}-${transaction.amount}-${transaction.category}`

                return (
                  <TransactionRow
                    key={key}
                    transaction={transaction}
                    onDeleteTransaction={onDeleteTransaction}
                    isDeleting={isDeleting}
                    forceDeletable
                    currency={currency}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

