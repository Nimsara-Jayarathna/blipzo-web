import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { BlockingModal } from '../../components/BlockingModal'

import dayjs from 'dayjs'
import { AppNavbar } from '../../layouts/AppNavbar'
import { Footer } from '../../components/Footer'
import { deleteTransaction, getTransactionsFiltered } from '../../api/transactions'
import { TabNavigation } from '../../components/TabNavigation'
import { TodayTransactionsPage } from './components/TodayTransactions/TodayTransactionsPage'
import { AllTransactionsPage } from './components/AllTransactions/AllTransactionsPage'
import { FloatingActionButton } from '../../components/FloatingActionButton'
import { AddTransactionModal } from '../../modals/AddTransaction'
import { SettingsModal } from '../../modals/Settings'
import { ReportsModal } from '../../modals/Reports'
import { logoutSession } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import type { Transaction } from '../../types'
import type { TransactionFilters } from '../../api/transactions'
import type { AllTransactionsFilters } from './components/AllTransactions/types'
import { Widget } from './components/Widget'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import { SummaryModal } from '../../modals/SummaryModal'
import { getCategories } from '../../api/categories'
import { getSupportedCurrencies } from '../../api/currencies'


const transactionKey = ['transactions']

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const queryClient = useQueryClient()
  const todayDate = dayjs().format('YYYY-MM-DD')
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD')
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [isReportsOpen, setReportsOpen] = useState(false)
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false)
  const [isSummaryOpen, setSummaryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [todayIncome, setTodayIncome] = useState(0)
  const [todayExpense, setTodayExpense] = useState(0)
  const [todayBalance, setTodayBalance] = useState(0)
  const [allFilters, setAllFilters] = useState<AllTransactionsFilters>({
    startDate: startOfMonth,
    endDate: endOfMonth,
    typeFilter: 'all',
    categoryFilter: 'all',
    sortField: 'date',
    sortDirection: 'desc',
  })

  const {
    data: todayData,
    isLoading: isTodayLoading,
  } = useQuery({
    queryKey: [...transactionKey, 'today', todayDate],
    queryFn: () =>
      getTransactionsFiltered({
        startDate: todayDate,
        endDate: todayDate,
      } as TransactionFilters),
    enabled: isAuthenticated && activeTab === 'today',
  })

  const {
    data: allData,
    isLoading: isAllLoading,
  } = useQuery({
    queryKey: [...transactionKey, 'all', { ...allFilters, categoryFilter: undefined }],
    queryFn: () =>
      getTransactionsFiltered({
        startDate: allFilters.startDate || undefined,
        endDate: allFilters.endDate || undefined,
        type: allFilters.typeFilter === 'all' ? undefined : allFilters.typeFilter,
        sortBy: allFilters.sortField,
        sortDir: allFilters.sortDirection,
      }),
    enabled: isAuthenticated && activeTab === 'all',
  })

  useEffect(() => {
    const items = todayData?.transactions ?? []
    setTodayTransactions(items)
    const income = items.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0)
    const expense = items.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0)
    setTodayIncome(income)
    setTodayExpense(expense)
    setTodayBalance(income - expense)
  }, [todayData])

  useEffect(() => {
    setAllTransactions(allData?.transactions ?? [])
  }, [allData])

  const {
    execute: executeDelete,
    isLoading: isDeleting,
    modal: blockingModal,
  } = useBlockingAsync(
    async (transaction: Transaction) => {
      const identifier = transaction._id ?? transaction.id

      if (!identifier) {
        throw new Error('Unable to delete transaction: missing identifier')
      }

      await deleteTransaction(identifier)
      return transaction
    },
    {
      successMessage: 'Transaction deleted successfully!',
      onSuccess: (deleted) => {
        setTodayTransactions(prev =>
          prev.filter(
            item => (item._id ?? item.id) !== (deleted._id ?? deleted.id),
          ),
        )
        setAllTransactions(prev =>
          prev.filter(
            item => (item._id ?? item.id) !== (deleted._id ?? deleted.id),
          ),
        )

        const todayReference = dayjs()
        if (dayjs(deleted.date).isSame(todayReference, 'day')) {
          if (deleted.type === 'income') {
            setTodayIncome(prev => prev - deleted.amount)
            setTodayBalance(prev => prev - deleted.amount)
          } else if (deleted.type === 'expense') {
            setTodayExpense(prev => prev - deleted.amount)
            setTodayBalance(prev => prev + deleted.amount)
          }
        }

        queryClient.invalidateQueries({ queryKey: transactionKey })
      },
    }
  )

  const handleDeleteTransaction = (transaction: Transaction) => {
    executeDelete(transaction)
  }

  const handleTransactionCreated = (transaction: Transaction) => {
    const todayReference = dayjs()
    setAllTransactions(prev => [transaction, ...prev])
    if (dayjs(transaction.date).isSame(todayReference, 'day')) {
      setTodayTransactions(prev => [transaction, ...prev])
      setTodayIncome(prev => prev + (transaction.type === 'income' ? transaction.amount : 0))
      setTodayExpense(prev => prev + (transaction.type === 'expense' ? transaction.amount : 0))
      setTodayBalance(prev => prev + (transaction.type === 'income' ? transaction.amount : -transaction.amount))
    }
  }

  const handleLogout = () => {
    void logoutSession().catch(() => { })
    logout()

    navigate('/', { replace: true })
  }

  const displayName = user?.name?.split(' ')[0] ?? user?.email ?? 'there'

  const filteredAllTransactions =
    allFilters.categoryFilter === 'all'
      ? allTransactions
      : allTransactions.filter(transaction => {
        const transactionCategoryId =
          transaction.categoryId ?? (typeof transaction.category === 'string' ? transaction.category : undefined)
        return transactionCategoryId === allFilters.categoryFilter
      })

  const [isSettingsLoading, setIsSettingsLoading] = useState(false)

  const handleOpenSettings = async () => {
    setIsSettingsLoading(true)
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['categories'],
          queryFn: getCategories,
          staleTime: 1000 * 60 * 5, // 5 minutes
        }),
        queryClient.prefetchQuery({
          queryKey: ['currencies'],
          queryFn: getSupportedCurrencies,
          staleTime: 1000 * 60 * 60, // 1 hour
        })
      ])
      setSettingsOpen(true)
    } finally {
      setIsSettingsLoading(false)
    }
  }

  return (
    <div
      data-theme={theme}
      className="relative flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--page-fg)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[var(--page-overlay-strong)] via-[var(--page-overlay-soft)] to-transparent" />
      {/* Subtle modern accent blobs */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#3498db]/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#2ecc71]/5 blur-[120px]" />
      <AppNavbar
        variant="dashboard"
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={handleOpenSettings}
        onOpenReports={() => setReportsOpen(true)}
        onLogout={handleLogout}
        userName={displayName}
      />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-6 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-8">
        <div className="flex items-center justify-center">
          <TabNavigation
            tabs={[
              { id: 'today' as const, label: "Today's Activity" },
              { id: 'all' as const, label: 'All Transactions' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <Widget>
          {activeTab === 'today' ? (
            <TodayTransactionsPage
              transactions={todayTransactions}
              // isLoading={isTodayLoading} // Handled by blocking modal
              income={todayIncome}
              expense={todayExpense}
              balance={todayBalance}
              onDeleteTransaction={handleDeleteTransaction}
              isDeleting={isDeleting}
              currency={user?.currency?.code}
            />
          ) : (
            <AllTransactionsPage
              transactions={filteredAllTransactions}
              // isLoading={isAllLoading} // Handled by blocking modal
              filters={allFilters}
              onFiltersChange={setAllFilters}
              onDeleteTransaction={handleDeleteTransaction}
              isDeleting={isDeleting}
              currency={user?.currency?.code}
            />
          )}
        </Widget>
      </main>

      {activeTab === 'all' && (
        <FloatingActionButton
          onClick={() => setSummaryOpen(true)}
          icon={faChartPie}
          label="View Summary"
          className="bottom-24 sm:bottom-28 bg-[var(--surface-glass)] text-[var(--fg)] hover:bg-[var(--surface-glass-thick)] border border-[var(--border-glass)]"
        />
      )}

      <FloatingActionButton onClick={() => setAddTransactionOpen(true)} />

      <SettingsModal open={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <SummaryModal
        open={isSummaryOpen}
        onClose={() => setSummaryOpen(false)}
        transactions={filteredAllTransactions}
        currency={user?.currency?.code}
        filters={allFilters}
      />
      <ReportsModal open={isReportsOpen} onClose={() => setReportsOpen(false)} />
      <AddTransactionModal
        open={isAddTransactionOpen}
        onClose={() => setAddTransactionOpen(false)}
        onTransactionCreated={handleTransactionCreated}
      />
      <Footer />
      {blockingModal}
      <BlockingModal
        state={isTodayLoading || isAllLoading || isSettingsLoading ? 'loading' : 'idle'}
        message={isSettingsLoading ? 'Loading settings...' : 'Updating transactions...'}
        onClose={() => { }}
      />
    </div>
  )
}
