import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'

import { Spinner } from '../../components/Spinner'
import { getCategories, deleteCategory, setDefaultCategory } from '../../api/categories'
import { ErrorBanner } from '../../components/ErrorBanner'
import { mapApiError } from '../../utils/errors'
import type { Category } from '../../types'
import { CategoriesGrid } from './CategoriesGrid'
import { AddCategoryModal } from './AddCategoryModal'

interface SettingsCategoriesTabProps {
    isAddCategoryOpen: boolean
    onAddCategoryClose: () => void
    onAddCategoryOpen: () => void
}

const categoryKey = ['categories']

export const SettingsCategoriesTab = ({ isAddCategoryOpen, onAddCategoryClose, onAddCategoryOpen }: SettingsCategoriesTabProps) => {
    const queryClient = useQueryClient()
    const [defaultIncomeId, setDefaultIncomeId] = useState('')
    const [defaultExpenseId, setDefaultExpenseId] = useState('')
    const [uiError, setUiError] = useState<{ message: string; detail?: string } | null>(null)
    const [activeType, setActiveType] = useState<'income' | 'expense'>('income')
    const [isMobile, setIsMobile] = useState(false)

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: categoryKey,
        queryFn: getCategories,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    })

    const categories = useMemo(() => data?.categories ?? [], [data?.categories])
    const categoriesLimit = data?.limit

    const resolveCategoryId = (category: Category) => category._id ?? category.id ?? ''

    const incomeCategories = useMemo(
        () => categories.filter(item => item.type === 'income'),
        [categories],
    )

    const expenseCategories = useMemo(
        () => categories.filter(item => item.type === 'expense'),
        [categories],
    )

    const {
        execute: executeDelete,
        isLoading: isDeleting,
        modal: deleteModal,
    } = useBlockingAsync((id: string) => deleteCategory(id), {
        successMessage: 'Category deleted!',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKey })
            setUiError(null)
        },
        onError: error => setUiError(mapApiError(error)),
    })

    const {
        execute: executeSetDefault,
        isLoading: isSettingDefault,
        modal: defaultModal,
    } = useBlockingAsync((categoryId: string) => setDefaultCategory(categoryId), {
        successMessage: 'Default category updated!',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKey })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            setUiError(null)
        },
        onError: error => setUiError(mapApiError(error)),
    })

    useEffect(() => {
        const incomeDefault = incomeCategories.find(item => item.isDefault)
        const expenseDefault = expenseCategories.find(item => item.isDefault)
        setDefaultIncomeId(incomeDefault ? resolveCategoryId(incomeDefault) : '')
        setDefaultExpenseId(expenseDefault ? resolveCategoryId(expenseDefault) : '')
    }, [categories, expenseCategories, incomeCategories])

    useEffect(() => {
        // Reset error when loading fresh data
        if (!isError) {
            setUiError(null)
        }
    }, [isError])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const mediaQuery = window.matchMedia('(max-width: 639px)')
        const update = () => setIsMobile(mediaQuery.matches)
        update()
        mediaQuery.addEventListener?.('change', update)
        return () => mediaQuery.removeEventListener?.('change', update)
    }, [])


    const handleDefaultSelect = (categoryId: string, categoryType: 'income' | 'expense') => {
        if (!categoryId) return
        if (categoryType === 'income') {
            if (categoryId === defaultIncomeId) return
            setDefaultIncomeId(categoryId)
        } else {
            if (categoryId === defaultExpenseId) return
            setDefaultExpenseId(categoryId)
        }
        executeSetDefault(categoryId)
    }

    const handleDelete = (category: Category) => {
        const identifier = resolveCategoryId(category)
        if (!identifier) {

            return
        }
        executeDelete(identifier)
    }

    const handleSetDefault = (category: Category) => {
        const identifier = resolveCategoryId(category)
        if (!identifier) {

            return
        }
        handleDefaultSelect(identifier, category.type)
    }

    return (
        <div className="relative flex h-full flex-col">
            <div className="mb-4 flex shrink-0 flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Categories</h2>
                    <p className="text-sm text-[var(--text-muted)]">Manage your income and expense categories</p>
                </div>
                <button
                    type="button"
                    onClick={onAddCategoryOpen}
                    className={`relative w-full overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 sm:w-auto sm:py-2.5 ${isMobile
                            ? 'bg-[#3498db] shadow-blue-500/20 hover:bg-[#2980b9] hover:shadow-blue-500/30'
                            : activeType === 'income'
                                ? 'bg-[#27ae60] shadow-green-500/20 hover:bg-[#229954] hover:shadow-green-500/30'
                                : 'bg-[#e74c3c] shadow-red-500/20 hover:bg-[#c0392b] hover:shadow-red-500/30'
                        }`}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Category</span>
                    </span>
                </button>
            </div>

            {/* Desktop: Segmented Control with reactive colors */}
            <div className="mb-4 hidden items-center justify-center md:flex">
                <div className="inline-flex items-center rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1">
                    {(['income', 'expense'] as const).map(type => {
                        const isActive = activeType === type
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setActiveType(type)}
                                className={`flex-1 rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${isActive
                                        ? type === 'income'
                                            ? 'bg-[#27ae60] text-white shadow-[0_10px_25px_-18px_rgba(39,174,96,0.8)]'
                                            : 'bg-[#e74c3c] text-white shadow-[0_10px_25px_-18px_rgba(231,76,60,0.8)]'
                                        : 'text-[var(--text-muted)]'
                                    }`}
                            >
                                {type === 'income' ? 'Income' : 'Expense'}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Mobile: Segmented Control with blue accent */}
            <div className="mb-4 flex items-center justify-center md:hidden">
                <div className="inline-flex w-full items-center rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1">
                    {(['income', 'expense'] as const).map(type => {
                        const isActive = activeType === type
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setActiveType(type)}
                                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${isActive
                                        ? 'bg-accent text-white shadow-[0_10px_25px_-18px_rgba(59,130,246,0.8)]'
                                        : 'text-[var(--text-muted)]'
                                    }`}
                            >
                                {type === 'income' ? 'Income' : 'Expense'}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col space-y-5">
                {uiError || isError ? (
                    <div className="flex shrink-0 justify-center">
                        <ErrorBanner
                            message={(uiError ?? mapApiError(error)).message}
                            detail={(uiError ?? mapApiError(error)).detail}
                            onRetry={isError ? () => refetch() : undefined}
                            className="w-full max-w-2xl"
                        />
                    </div>
                ) : null}

                <div className="min-h-0 flex-1 sm:group sm:relative sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[var(--border-glass)] sm:bg-gradient-to-br sm:from-[var(--surface-glass)] sm:to-[var(--surface-glass)]/30 sm:p-1 sm:transition-all sm:hover:border-[var(--border-glass-strong)] sm:hover:shadow-lg sm:hover:shadow-black/5">
                    <div className="relative h-full overflow-hidden sm:rounded-[1.4rem] sm:bg-[var(--page-bg)]/40 sm:p-6 sm:backdrop-blur-xl sm:overflow-hidden flex flex-col">
                        <CategoriesGrid
                            isLoading={isLoading}
                            categories={categories}
                            limit={categoriesLimit}
                            view={isMobile ? activeType : 'all'}
                            deleteMutation={{ isPending: isDeleting, variables: undefined }}
                            resolveCategoryId={resolveCategoryId}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                            isSettingDefault={isSettingDefault}
                        />
                    </div>
                </div>
            </div>

            {/* Loading Overlay for Fetching Only */}
            {(isLoading || isFetching) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface-glass)] backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" className="text-accent" />
                        <p className="text-xs font-medium text-[var(--text-muted)]">Updating categories...</p>
                    </div>
                </div>
            )}

            <AddCategoryModal
                open={isAddCategoryOpen}
                onClose={onAddCategoryClose}
                categories={categories}
                limit={categoriesLimit}
            />
            {deleteModal}
            {defaultModal}
        </div>
    )
}
