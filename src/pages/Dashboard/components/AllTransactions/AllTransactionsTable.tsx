import type { Transaction } from '../../../../types'
import type { GroupedTransactions } from './types'
import { TransactionTableHeader } from './table/TransactionTableHeader'
import { TransactionRow } from './table/TransactionRow'
import { TransactionCard } from './table/TransactionCard'

interface AllTransactionsTableProps {
  transactions: Transaction[]
  grouped?: GroupedTransactions[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

const renderRows = (
  list: Transaction[],
  onDeleteTransaction?: (transaction: Transaction) => void,
  isDeleting?: boolean,
  currency?: string,
) =>
  list.map(transaction => {
    const key =
      transaction._id ?? transaction.id ?? `${transaction.date}-${transaction.amount}-${transaction.category}`
    return (
      <TransactionRow
        key={key}
        transaction={transaction}
        onDeleteTransaction={onDeleteTransaction}
        isDeleting={isDeleting}
        currency={currency}
      />
    )
  })

export const AllTransactionsTable = ({
  transactions,
  grouped,
  onDeleteTransaction,
  isDeleting,
  currency,
}: AllTransactionsTableProps) => {
  if (grouped && grouped.length > 0) {
    return (
      <>
        <div className="space-y-4 sm:hidden">
          {grouped.map(group => (
            <section
              key={group.label}
              className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-3 shadow-soft backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-1 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--page-fg)]">
                    Group: {group.label}
                  </span>
                </div>
                <span className="rounded-full border border-accent/40 bg-[var(--surface-glass)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {group.items.length} items
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {group.items.map(transaction => (
                  <TransactionCard
                    key={
                      transaction._id ??
                      transaction.id ??
                      `${transaction.date}-${transaction.amount}-${transaction.category}`
                    }
                    transaction={transaction}
                    onDeleteTransaction={onDeleteTransaction}
                    isDeleting={isDeleting}
                    currency={currency}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="hidden sm:block -mx-4 overflow-x-auto sm:mx-0 sm:overflow-hidden sm:rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] shadow-soft backdrop-blur-xl">
          <div className="inline-block min-w-full align-middle">
            {grouped.map(group => (
              <div key={group.label} className="border-b border-[var(--border-glass)] last:border-b-0">
                <div className="flex items-center justify-between border-b border-[var(--border-glass)] bg-[var(--surface-glass)] px-5 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--page-fg)]">
                      Group: {group.label}
                    </span>
                  </div>
                  <span className="rounded-full border border-accent/40 bg-[var(--surface-glass)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent shadow-[0_10px_25px_-20px_rgba(52,152,219,0.7)] backdrop-blur-md">
                    {group.items.length} items
                  </span>
                </div>
                <table className="min-w-full table-fixed text-left">
                  <colgroup>
                    <col className="w-[140px]" />
                    <col className="w-[240px]" />
                    <col className="w-[140px]" />
                    <col />
                    <col className="w-[56px]" />
                  </colgroup>
                  <TransactionTableHeader />
                  <tbody>{renderRows(group.items, onDeleteTransaction, isDeleting, currency)}</tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="space-y-3 sm:hidden">
        {transactions.map(transaction => (
          <TransactionCard
            key={
              transaction._id ??
              transaction.id ??
              `${transaction.date}-${transaction.amount}-${transaction.category}`
            }
            transaction={transaction}
            onDeleteTransaction={onDeleteTransaction}
            isDeleting={isDeleting}
            currency={currency}
          />
        ))}
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
            <tbody>{renderRows(transactions, onDeleteTransaction, isDeleting, currency)}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}

