import type { ReactNode } from 'react'
import { formatCurrency } from '../../../../utils/format'

interface SummaryCardProps {
  title: string
  amount: number
  icon: ReactNode
  accent?: 'income' | 'expense' | 'balance'
  highlight?: string
  currency?: string
}

const accentStyles = {
  income: {
    container: 'border-emerald-500/20 hover:border-emerald-500/40',
    icon: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    glow: 'bg-emerald-500/10',
    text: 'text-emerald-500',
  },
  expense: {
    container: 'border-rose-500/20 hover:border-rose-500/40',
    icon: 'border-rose-500/30 bg-rose-500/10 text-rose-500',
    glow: 'bg-rose-500/10',
    text: 'text-rose-500',
  },
  balance: {
    container: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
    glow: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
}

export const SummaryCard = ({ title, amount, icon, accent = 'balance', highlight, currency }: SummaryCardProps) => {
  const styles = accentStyles[accent]
  const cleanTitle = title.replace(/today's/gi, '').trim()

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl p-4
        bg-[var(--surface-glass)] backdrop-blur-xl
        border transition-all duration-300
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        ${styles.container}
      `}
    >
      {/* Glow Effect - Smaller and subtle */}
      <div className={`absolute -right-2 -top-2 h-16 w-16 rounded-full blur-[30px] opacity-40 ${styles.glow}`} />

      {/* Horizontal Layout Container */}
      <div className="relative flex items-center gap-4">
        
        {/* Left: Icon (Smaller & Compact) */}
        <div className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
          transition-transform duration-500 group-hover:scale-110
          ${styles.icon}
        `}>
          <span className="scale-110">{icon}</span>
        </div>

        {/* Center: Title and Amount Stacked Tightly */}
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] leading-none mb-1">
            {cleanTitle}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--page-fg)] leading-none">
            {formatCurrency(amount, currency)}
          </h3>
        </div>

        {/* Right: Optional Highlight (Minimalist) */}
        {highlight && (
          <div className="ml-auto">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 ${styles.text}`}>
              {highlight.replace(/today/gi, '').trim()}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}