import { Modal } from '../components/Modal'
import { formatCurrency } from '../utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faWallet, faTimes } from '@fortawesome/free-solid-svg-icons'
import type { Transaction } from '../types'
import type { AllTransactionsFilters } from '../pages/Dashboard/components/AllTransactions/types'
import dayjs from 'dayjs'

interface SummaryModalProps {
    open: boolean
    onClose: () => void
    transactions: Transaction[]
    currency?: string
    filters?: AllTransactionsFilters
}

/**
 * Modern typographic styling for currency amounts.
 */
const StyledAmount = ({ amount, currency, isNegative = false, className = '', mutedZero = false }: { amount: number, currency: string, isNegative?: boolean, className?: string, mutedZero?: boolean }) => {
    if (amount === 0 && mutedZero) {
        return (
            <span className={`${className} text-[var(--muted-fg)] opacity-40 font-medium`}>
                <span className="text-[0.6em] mr-1.5 font-light tracking-widest uppercase">{currency}</span>
                <span>0.00</span>
            </span>
        )
    }

    const absAmount = Math.abs(amount)
    const formatted = formatCurrency(absAmount, currency)

    const match = formatted.match(/^([A-Z]{3}|[^0-9\s]+)\s?(.+)/)
    const currencyPart = match ? match[1] : currency
    const valuePart = match ? match[2] : formatted

    return (
        <span className={`${className} inline-flex items-baseline`}>
            {isNegative && <span className="mr-0.5 opacity-30 font-light">(</span>}
            <span className="mr-2 text-[0.55em] font-medium tracking-widest uppercase opacity-40 leading-none">
                {currencyPart}
            </span>
            <span className="leading-none">{valuePart}</span>
            {isNegative && <span className="ml-0.5 opacity-30 font-light">)</span>}
        </span>
    )
}

export const SummaryModal = ({ open, onClose, transactions, currency = 'LKR', filters }: SummaryModalProps) => {
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense
    const isNegative = balance < 0

    const startDate = filters?.startDate ? dayjs(filters.startDate).format('MMM D') : ''
    const endDate = filters?.endDate ? dayjs(filters.endDate).format('MMM D, YYYY') : ''
    const dateRangeText = startDate && endDate ? `${startDate} — ${endDate}` : 'Overall Summary'

    const customClose = (
        <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-fg)] transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-90"
        >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
        </button>
    )

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Transaction Summary"
            subtitle={dateRangeText}
            headerActions={customClose}
            showCloseButton={false}
        >
            <div className="flex flex-col gap-8 p-1">
                <div className="flex flex-col gap-6">

                    {/* Main Net Balance Card - Floating Effect */}
                    <div
                        className={`group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 shadow-sm
                            ${isNegative
                                ? 'bg-rose-50/50 dark:bg-rose-500/[0.1] border border-rose-200/50 dark:border-rose-500/20'
                                : 'bg-emerald-50/50 dark:bg-emerald-500/[0.1] border border-emerald-200/50 dark:border-emerald-500/20'
                            }`}
                    >
                        <div className="relative flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/5
                                    ${isNegative ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                    <FontAwesomeIcon icon={faWallet} className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-70">
                                    Net Balance
                                </span>
                            </div>

                            <div className={`text-5xl font-black tracking-tighter transition-colors ${isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                <StyledAmount amount={balance} currency={currency} isNegative={isNegative} />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Cards Grid - Pure Floating Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Income Box */}
                        <div className="relative flex flex-col gap-4 rounded-[2.25rem] bg-[var(--surface-glass)] dark:bg-[var(--surface-glass-thick)] p-6 shadow-sm ring-1 ring-[var(--border-glass)] transition-all hover:translate-y-[-4px]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <FontAwesomeIcon icon={faArrowUp} className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-fg)] opacity-50">Income</span>
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-[var(--page-fg)] pl-1">
                                <StyledAmount amount={income} currency={currency} mutedZero={true} />
                            </div>
                        </div>

                        {/* Expense Box */}
                        <div className="relative flex flex-col gap-4 rounded-[2.25rem] bg-[var(--surface-glass)] dark:bg-[var(--surface-glass-thick)] p-6 shadow-sm ring-1 ring-[var(--border-glass)] transition-all hover:translate-y-[-4px]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                                    <FontAwesomeIcon icon={faArrowDown} className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-fg)] opacity-50">Expense</span>
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-[var(--page-fg)] pl-1">
                                <StyledAmount amount={expense} currency={currency} mutedZero={true} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Status Indicator Footer */}
                <div className="mt-2 flex flex-col items-center gap-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent opacity-50" />
                    <div className="flex items-center gap-2.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${isNegative ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--muted-fg)] opacity-30">
                            {transactions.length} Records Analyzed
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}