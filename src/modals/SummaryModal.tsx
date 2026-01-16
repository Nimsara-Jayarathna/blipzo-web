import { Modal } from '../components/Modal'
import { formatCurrency, formatShortDate } from '../utils/format'
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

// Helper to split currency and amount for styling
const StyledAmount = ({ amount, currency, isNegative = false, className = '' }: { amount: number, currency: string, isNegative?: boolean, className?: string }) => {
    // Format: "LKR 1,234.00"
    const formatted = formatCurrency(Math.abs(amount), currency)
    // Extract parts (crude but effective given formatCurrency output)
    // Assuming format is "CODE 123.00" or "$123.00". 
    // For this specific request, we want to separate the code/symbol from the value if possible, 
    // or just rely on the formatted string but wrap in () if negative.

    // Let's stick to the requested parentheses for negative
    const displayValue = isNegative ? `(${formatted})` : formatted

    // If we want to style LKR differently, we'd need to parse it. 
    // For now, let's just make the font lighter for the whole currency code if it's text.
    // A regex to match the currency code at the start
    const match = displayValue.match(/^([A-Z]{3}|[^0-9\s]+)\s?(.+)/)

    if (match) {
        const [_, code, val] = match
        return (
            <span className={className}>
                <span className="mr-1 text-0.8em font-normal opacity-70">{code}</span>
                <span>{val}</span>
            </span>
        )
    }

    return <span className={className}>{displayValue}</span>
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

    // Date Range Logic
    const startDate = filters?.startDate ? dayjs(filters.startDate).format('MMM D') : 'Start'
    const endDate = filters?.endDate ? dayjs(filters.endDate).format('MMM D, YYYY') : 'End'
    const dateRangeText = filters?.startDate && filters?.endDate ? `${startDate} - ${endDate}` : 'All Time'

    return (
        <Modal open={open} onClose={onClose} title="Transaction Summary" showCloseButton={false}>
            {/* Custom Header with X button */}
            <div className="absolute right-4 top-4">
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-fg)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--fg)]"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <p className="text-sm font-medium text-[var(--muted-fg)] uppercase tracking-wide opacity-80">{dateRangeText}</p>
                </div>

                <div className="grid gap-4">
                    {/* Balance Card */}
                    <div
                        className={`relative overflow-hidden rounded-3xl p-6 ring-1 ring-inset transition-colors duration-300
                            ${isNegative
                                ? 'bg-rose-50/50 ring-rose-200 dark:bg-rose-900/10 dark:ring-rose-800/30'
                                : 'bg-emerald-50/50 ring-emerald-200 dark:bg-emerald-900/10 dark:ring-emerald-800/30'
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl
                                ${isNegative ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20' : 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20'}`}>
                                <FontAwesomeIcon icon={faWallet} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-[var(--muted-fg)]">Net Balance</p>
                                <div className={`text-2xl font-bold ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    <StyledAmount amount={balance} currency={currency} isNegative={isNegative} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Income Card */}
                        <div className="flex flex-col items-end justify-between rounded-3xl bg-[var(--surface-card)] p-5 shadow-sm ring-1 ring-inset ring-[var(--border-subtle)]">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20">
                                <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-[var(--muted-fg)]">Total Income</p>
                                <p className={`text-lg font-bold ${income === 0 ? 'text-[var(--muted-fg)] opacity-50' : 'text-[var(--fg)]'}`}>
                                    <StyledAmount amount={income} currency={currency} />
                                </p>
                            </div>
                        </div>

                        {/* Expense Card */}
                        <div className="flex flex-col items-end justify-between rounded-3xl bg-[var(--surface-card)] p-5 shadow-sm ring-1 ring-inset ring-[var(--border-subtle)]">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-500/20">
                                <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-[var(--muted-fg)]">Total Expense</p>
                                <p className={`text-lg font-bold ${expense === 0 ? 'text-[var(--muted-fg)] opacity-50' : 'text-[var(--fg)]'}`}>
                                    <StyledAmount amount={expense} currency={currency} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-[var(--muted-fg)]">
                        Summary based on {transactions.length} filtered transactions
                    </p>
                </div>
            </div>
        </Modal>
    )
}
