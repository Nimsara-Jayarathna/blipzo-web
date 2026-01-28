import { formatCurrency } from '../../../../utils/format'

interface MobileTodaySummaryCardProps {
  income: number
  expense: number
  balance: number
  currency?: string
  collapsed?: boolean
}

export const MobileTodaySummaryCard = ({
  income,
  expense,
  balance,
  currency,
  collapsed = false,
}: MobileTodaySummaryCardProps) => {
  const balanceClass = balance >= 0 ? 'text-accent' : 'text-expense'

  return (
    <div
      className={`rounded-[1.5rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] px-4 shadow-sm backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'py-3' : 'py-4'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Today&apos;s Balance
          </p>
          <p className={`text-2xl font-semibold tracking-tight ${balanceClass}`}>
            {balance < 0 ? '-' : ''}
            {formatCurrency(Math.abs(balance), currency)}
          </p>
        </div>
      </div>

      {!collapsed ? (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border-soft)] pt-4">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Income
            </p>
            <p className="text-base font-semibold text-income">
              {formatCurrency(income, currency)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Expense
            </p>
            <p className="text-base font-semibold text-expense">
              {formatCurrency(expense, currency)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
