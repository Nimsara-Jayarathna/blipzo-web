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
import { buttonStyles, cardStyles } from './settingsStyles'

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
            <div className="mb-4 flex shrink-0 flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
                <div className="hidden md:block">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Categories</h2>
                    <p className="text-sm text-[var(--text-muted)]">Manage your income and expense categories</p>
                </div>
                <button
                    type="button"
                    onClick={onAddCategoryOpen}
                    className={`w-full md:w-auto ${buttonStyles.primary}`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Category</span>
                    </span>
                </button>
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

                <div className={cardStyles.primary}>
                    <CategoriesGrid
                        isLoading={isLoading}
                        categories={categories}
                        limit={categoriesLimit}
                        view="all"
                        deleteMutation={{ isPending: isDeleting, variables: undefined }}
                        resolveCategoryId={resolveCategoryId}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                        isSettingDefault={isSettingDefault}
                    />
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
