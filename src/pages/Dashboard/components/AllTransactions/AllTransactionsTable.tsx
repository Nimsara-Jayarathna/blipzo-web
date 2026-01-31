import type { Transaction } from '../../../../types'
import type { GroupedTransactions } from './types'
import { TransactionTableHeader } from './table/TransactionTableHeader'
import { TransactionRow } from './table/TransactionRow'
import { TransactionCard } from './table/TransactionCard'
import { formatCurrency } from '../../../../utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faEquals } from '@fortawesome/free-solid-svg-icons'

interface AllTransactionsTableProps {
  transactions: Transaction[]
  grouped?: GroupedTransactions[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
  hideCategory?: boolean
}

const renderRows = (
  list: Transaction[],
  onDeleteTransaction?: (transaction: Transaction) => void,
  isDeleting?: boolean,
  currency?: string,
  hideCategory?: boolean,
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
        hideCategory={hideCategory}
      />
    )
  })

const getGroupTotals = (items: Transaction[]) => {
  const income = items
    .filter(item => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)
  const expense = items
    .filter(item => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)
  return {
    income,
    expense,
    balance: income - expense,
  }
}

export const AllTransactionsTable = ({
  transactions,
  grouped,
  onDeleteTransaction,
  isDeleting,
  currency,
  hideCategory = false,
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-glass)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-1 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--page-fg)]">
                    Group: {group.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em]">
                  {(() => {
                    const totals = getGroupTotals(group.items)
                    return (
                      <>
                        <span className="inline-flex items-center gap-1 text-income">
                          <FontAwesomeIcon icon={faArrowUp} />
                          {formatCurrency(totals.income, currency)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-expense">
                          <FontAwesomeIcon icon={faArrowDown} />
                          {formatCurrency(totals.expense, currency)}
                        </span>
                        <span className={`inline-flex items-center gap-1 ${totals.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                          <FontAwesomeIcon icon={faEquals} />
                          {formatCurrency(totals.balance, currency)}
                        </span>
                      </>
                    )
                  })()}
                </div>
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
                  <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    {(() => {
                      const totals = getGroupTotals(group.items)
                      return (
                        <>
                          <span className="inline-flex items-center gap-1 text-income">
                            <FontAwesomeIcon icon={faArrowUp} />
                            {formatCurrency(totals.income, currency)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-expense">
                            <FontAwesomeIcon icon={faArrowDown} />
                            {formatCurrency(totals.expense, currency)}
                          </span>
                          <span className={`inline-flex items-center gap-1 ${totals.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                            <FontAwesomeIcon icon={faEquals} />
                            {formatCurrency(totals.balance, currency)}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                </div>
                <table className="min-w-full table-fixed text-left">
                  <colgroup>
                    <col className="w-[140px]" />
                    {!hideCategory ? <col className="w-[240px]" /> : null}
                    <col className="w-[140px]" />
                    <col />
                    <col className="w-[56px]" />
                  </colgroup>
                  <TransactionTableHeader hideCategory={hideCategory} />
                  <tbody>{renderRows(group.items, onDeleteTransaction, isDeleting, currency, hideCategory)}</tbody>
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
              {!hideCategory ? <col className="w-[240px]" /> : null}
              <col className="w-[140px]" />
              <col />
              <col className="w-[56px]" />
            </colgroup>
            <TransactionTableHeader hideCategory={hideCategory} />
            <tbody>{renderRows(transactions, onDeleteTransaction, isDeleting, currency, hideCategory)}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
