import type { Transaction } from '../../../../../types'
import { formatCurrency, formatDate } from '../../../../../utils/format'
import { isToday } from '../../../../../utils/date'

const resolveCategory = (transaction: Transaction) => {
  if (typeof transaction.category === 'string') {
    return transaction.category || transaction.categoryName || transaction.title || 'Transaction'
  }
  return transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
}

interface TransactionRowProps {
  transaction: Transaction
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

interface DeleteActionCellProps {
  canDelete: boolean
  isDeleting?: boolean
  onClick?: () => void
}

const DeleteActionCell = ({ canDelete, isDeleting, onClick }: DeleteActionCellProps) => {
  const baseClasses =
    'inline-flex h-8 w-8 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]'

  if (canDelete) {
    return (
      <button
        type="button"
        title="Delete (today only)"
        onClick={onClick}
        disabled={isDeleting}
        className={`${baseClasses} bg-transparent hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="text-lg leading-none" style={{ color: '#ff0000' }}>
          ×
        </span>
      </button>
    )
  }

  return (
    <div className={`${baseClasses} cursor-default`}>
      <span className="text-lg leading-none" style={{ color: '#666666' }}>
        ×
      </span>
    </div>
  )
}

interface TransactionRowComponentProps extends TransactionRowProps {
  forceDeletable?: boolean
}

export const TransactionRow = ({
  transaction,
  onDeleteTransaction,
  isDeleting,
  forceDeletable = false,
  currency,
}: TransactionRowComponentProps) => {
  const isIncome = transaction.type === 'income'
  const canDelete = !!onDeleteTransaction && (forceDeletable || isToday(transaction.date))

  return (
    <tr className="group border-b border-[var(--border-glass)] last:border-b-0 hover:bg-[var(--surface-glass)]">
      <td className="px-4 py-3 text-sm text-[var(--page-fg)]">{formatDate(transaction.date)}</td>
      <td
        className="max-w-[200px] truncate px-4 py-3 text-sm text-[var(--page-fg)]"
        title={resolveCategory(transaction)}
      >
        {resolveCategory(transaction)}
      </td>
      <td
        className={`px-4 py-3 text-right text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(Math.abs(transaction.amount), currency)}
      </td>
      <td
        className="max-w-[360px] truncate hidden md:table-cell px-4 py-3 text-sm text-[var(--text-muted)]"
        title={transaction.note ?? 'No note'}
      >
        {transaction.note ?? 'No note'}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        <DeleteActionCell
          canDelete={canDelete}
          isDeleting={isDeleting}
          onClick={onDeleteTransaction ? () => onDeleteTransaction(transaction) : undefined}
        />
      </td>
    </tr>
  )
}
