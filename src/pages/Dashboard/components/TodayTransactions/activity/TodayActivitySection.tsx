import { useEffect, useRef, useState } from 'react'
import type { Transaction } from '../../../../../types'
import { Spinner } from '../../../../../components/Spinner'
import { TodaySummaryCards } from '../TodaySummaryCards'
import { TodayTransactionsTable } from '../TodayTransactionsTable'
import { EmptyState } from '../../ui/EmptyState'
import { ListHeader } from '../../Transactions/ListHeader'
import { MobileTodaySummaryCard } from '../MobileTodaySummaryCard'

interface TodayActivitySectionProps {
  transactions: Transaction[]
  isLoading?: boolean
  income: number
  expense: number
  balance: number
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
  currency?: string
}

export const TodayActivitySection = ({
  transactions,
  isLoading = false,
  income,
  expense,
  balance,
  onDeleteTransaction,
  isDeleting,
  currency,
}: TodayActivitySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const listScrollRef = useRef<HTMLDivElement | null>(null)
  const isMobileRef = useRef(false)
  const collapsedRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const handleBreakpoint = () => {
      const isMobile = mediaQuery.matches
      isMobileRef.current = isMobile
      if (!isMobile) {
        collapsedRef.current = false
        setIsCollapsed(false)
        if (listScrollRef.current) listScrollRef.current.scrollTop = 0
      }
    }

    handleBreakpoint()
    mediaQuery.addEventListener?.('change', handleBreakpoint)

    return () => {
      mediaQuery.removeEventListener?.('change', handleBreakpoint)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden sm:h-auto sm:gap-6 sm:overflow-visible">
      <div className="sm:hidden">
        <MobileTodaySummaryCard
          income={income}
          expense={expense}
          balance={balance}
          currency={currency}
          collapsed={isCollapsed}
        />
      </div>
      <div className="hidden sm:block">
        <TodaySummaryCards income={income} expense={expense} balance={balance} currency={currency} />
      </div>
      <section className="flex min-h-0 flex-1 flex-col rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-4 shadow-sm backdrop-blur-xl sm:rounded-[2.5rem] sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <ListHeader title="Today's Activity" />
          <div className="sm:hidden">
            {/* Mobile specific header actions if needed */}
          </div>
        </div>
        <div
          ref={listScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 sm:overflow-visible sm:pr-0"
          onScroll={(event) => {
            if (!isMobileRef.current) return
            if (rafRef.current) return
            rafRef.current = requestAnimationFrame(() => {
              rafRef.current = null
              const nextCollapsed = event.currentTarget.scrollTop > 40
              if (nextCollapsed !== collapsedRef.current) {
                collapsedRef.current = nextCollapsed
                setIsCollapsed(nextCollapsed)
              }
            })
          }}
        >
          {isLoading ? (
            <Spinner size="lg" centered />
          ) : transactions && transactions.length ? (
            <TodayTransactionsTable
              transactions={transactions}
              onDeleteTransaction={onDeleteTransaction}
              isDeleting={isDeleting}
              currency={currency}
            />
          ) : (
            <EmptyState
              title="No activity today"
              description="Add a transaction to see it reflected in today's activity."
            />
          )}
        </div>
      </section>
    </div>
  )
}
