import type { Transaction } from '../../../../../types'
import { formatCurrency, formatShortDate } from '../../../../../utils/format'
import { isToday } from '../../../../../utils/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const resolveCategory = (transaction: Transaction) => {
  if (typeof transaction.category === 'string') {
    return transaction.category || transaction.categoryName || transaction.title || 'Transaction'
  }
  return transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
}

interface TransactionCardProps {
  transaction: Transaction
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
  forceDeletable?: boolean
}

export const TransactionCard = ({
  transaction,
  onDeleteTransaction,
  isDeleting,
  currency,
  forceDeletable = false,
}: TransactionCardProps) => {
  const isIncome = transaction.type === 'income'
  const canDelete = !!onDeleteTransaction && (forceDeletable || isToday(transaction.date))
  const amountLabel = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount), currency)}`
  const categoryLabel = resolveCategory(transaction)

  return (
    <article className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-3 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--page-fg)]" title={categoryLabel}>
            {categoryLabel}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            <span>{formatShortDate(transaction.date)}</span>
            <span className="h-3 w-px bg-[var(--border-glass)]" aria-hidden="true" />
            <span className={isIncome ? 'text-income' : 'text-expense'}>
              {isIncome ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className={`text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>{amountLabel}</p>
          <button
            type="button"
            title={canDelete ? 'Delete (today only)' : 'Delete'}
            onClick={canDelete ? () => onDeleteTransaction?.(transaction) : undefined}
            disabled={!canDelete || isDeleting}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
              canDelete
                ? 'text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'
                : 'cursor-not-allowed text-[var(--text-subtle)] opacity-60'
            }`}
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </button>
        </div>
      </div>

      {transaction.note ? (
        <p className="mt-2 text-xs text-[var(--text-muted)]">{transaction.note}</p>
      ) : null}
    </article>
  )
}
