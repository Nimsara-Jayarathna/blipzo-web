import type { Transaction } from '../../../../../types'
import { formatCurrency, formatShortDate } from '../../../../../utils/format'
import { isToday } from '../../../../../utils/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faCartShopping,
  faChartLine,
  faGift,
  faMoneyBillWave,
  faMugHot,
  faTag,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'

const resolveCategory = (transaction: Transaction) => {
  if (typeof transaction.category === 'string') {
    return transaction.category || transaction.categoryName || transaction.title || 'Transaction'
  }
  return transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
}

const resolveCategoryIcon = (label: string) => {
  const key = label.toLowerCase()
  if (key.includes('stock') || key.includes('invest')) return faChartLine
  if (key.includes('freelance') || key.includes('job') || key.includes('salary')) return faBriefcase
  if (key.includes('coffee') || key.includes('tea')) return faMugHot
  if (key.includes('food') || key.includes('dinner') || key.includes('lunch')) return faUtensils
  if (key.includes('shopping') || key.includes('grocery')) return faCartShopping
  if (key.includes('gift')) return faGift
  if (key.includes('bill') || key.includes('rent') || key.includes('fee')) return faMoneyBillWave
  return faTag
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
  const amountLabel = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount), currency)}`
  const categoryLabel = resolveCategory(transaction)
  const categoryIcon = resolveCategoryIcon(categoryLabel)

  return (
    <article className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm ${
              isIncome
                ? 'border-income/40 bg-income/15 text-income'
                : 'border-expense/40 bg-expense/15 text-expense'
            }`}
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={categoryIcon} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--page-fg)]" title={categoryLabel}>
              {categoryLabel}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span>{formatShortDate(transaction.date)}</span>
              <span className="h-3 w-px bg-[var(--border-glass)]" aria-hidden="true" />
              <span className={isIncome ? 'text-income' : 'text-expense'}>
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className={`text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>{amountLabel}</p>
          {onDeleteTransaction && (forceDeletable || isToday(transaction.date)) ? (
            <button
              type="button"
              title="Delete (today only)"
              onClick={() => onDeleteTransaction?.(transaction)}
              disabled={isDeleting}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)] transition hover:text-[var(--page-fg)]"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {transaction.note ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">{transaction.note}</p>
      ) : null}
    </article>
  )
}
