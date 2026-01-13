import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
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

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            toast.success('Category removed')
            queryClient.invalidateQueries({ queryKey: categoryKey })
            setUiError(null)
        },
        onError: error => setUiError(mapApiError(error)),
    })

    const setDefaultMutation = useMutation({
        mutationFn: (categoryId: string) => setDefaultCategory(categoryId),
        onSuccess: () => {
            toast.success('Default category updated')
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
        setDefaultMutation.mutate(categoryId)
    }

    const handleDelete = (category: Category) => {
        const identifier = resolveCategoryId(category)
        if (!identifier) {
            toast.error('Unable to delete category: missing identifier')
            return
        }
        deleteMutation.mutate(identifier)
    }

    const handleSetDefault = (category: Category) => {
        const identifier = resolveCategoryId(category)
        if (!identifier) {
            toast.error('Unable to set default: missing identifier')
            return
        }
        handleDefaultSelect(identifier, category.type)
    }

    return (
        <div className="relative flex h-full flex-col">
            <div className="mb-6 flex shrink-0 items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--page-fg)]">Categories</h3>
                    <p className="text-sm text-[var(--text-muted)]">Manage your income and expense categories</p>
                </div>
                <button
                    type="button"
                    onClick={onAddCategoryOpen}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-glass)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent transition hover:bg-accent hover:text-white"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add New</span>
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

                <div className="min-h-0 flex-1">
                    <CategoriesGrid
                        isLoading={isLoading}
                        categories={categories}
                        limit={categoriesLimit}
                        deleteMutation={deleteMutation}
                        resolveCategoryId={resolveCategoryId}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                        isSettingDefault={setDefaultMutation.isPending}
                    />
                </div>
            </div>

            {(isLoading || isFetching || deleteMutation.isPending || setDefaultMutation.isPending) && (
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
        </div>
    )
}
