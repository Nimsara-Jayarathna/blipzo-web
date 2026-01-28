import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
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
      className={`relative rounded-[1.5rem] border border-[rgba(148,163,184,0.45)] bg-[rgba(30,41,59,0.55)] px-4 shadow-[0_16px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'py-3' : 'py-4'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-white/5" />
      <div className="flex flex-col items-center justify-center text-center">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Today&apos;s Balance
          </p>
          <p className={`text-[26px] font-semibold tracking-tight ${balanceClass}`}>
            {balance < 0 ? '-' : ''}
            {formatCurrency(Math.abs(balance), currency)}
          </p>
        </div>
      </div>

      {!collapsed ? (
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Income
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-income">
              <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
              <p className="text-lg font-semibold">
              {formatCurrency(income, currency)}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Expense
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-expense">
              <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
              <p className="text-lg font-semibold">
              {formatCurrency(expense, currency)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
