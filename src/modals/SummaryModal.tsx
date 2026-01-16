import { Modal } from '../components/Modal'
import { formatCurrency } from '../utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faWallet } from '@fortawesome/free-solid-svg-icons'
import type { Transaction } from '../types'

interface SummaryModalProps {
    open: boolean
    onClose: () => void
    transactions: Transaction[]
    currency?: string
}

export const SummaryModal = ({ open, onClose, transactions, currency = 'LKR' }: SummaryModalProps) => {
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense

    return (
        <Modal open={open} onClose={onClose} title="Transaction Summary">
            <div className="flex flex-col gap-4">
                <p className="text-center text-sm text-[var(--muted-fg)]">
                    Summary based on {transactions.length} filtered transactions
                </p>

                <div className="grid gap-3">
                    {/* Balance Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 ring-1 ring-inset ring-white/5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                <FontAwesomeIcon icon={faWallet} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-[var(--muted-fg)]">Net Balance</p>
                                <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {formatCurrency(balance, currency)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Income Card */}
                        <div className="flex flex-col items-end rounded-2xl bg-[var(--surface-glass)] p-4 ring-1 ring-inset ring-[var(--border-glass)]">
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                <FontAwesomeIcon icon={faArrowUp} className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-xs font-medium text-[var(--muted-fg)]">Total Income</p>
                            <p className="text-lg font-bold text-[var(--fg)]">
                                {formatCurrency(income, currency)}
                            </p>
                        </div>

                        {/* Expense Card */}
                        <div className="flex flex-col items-end rounded-2xl bg-[var(--surface-glass)] p-4 ring-1 ring-inset ring-[var(--border-glass)]">
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                                <FontAwesomeIcon icon={faArrowDown} className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-xs font-medium text-[var(--muted-fg)]">Total Expense</p>
                            <p className="text-lg font-bold text-[var(--fg)]">
                                {formatCurrency(expense, currency)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
