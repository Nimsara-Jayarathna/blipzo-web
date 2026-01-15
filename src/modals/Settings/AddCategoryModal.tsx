import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'

import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { createCategory } from '../../api/categories'
import { mapApiError } from '../../utils/errors'

interface AddCategoryModalProps {
  open: boolean
  onClose: () => void
  categories: { type: 'income' | 'expense' }[]
  limit?: number
}

const categoryKey = ['categories']

export const AddCategoryModal = ({ open, onClose, categories, limit }: AddCategoryModalProps) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [uiError, setUiError] = useState<string | null>(null)
  const [savingType, setSavingType] = useState<'income' | 'expense' | null>(null)

  useEffect(() => {
    if (open) {
      setName('')
      setUiError(null)
      setSavingType(null)
    }
  }, [open])

  const {
    execute: executeCreate,
    isLoading: isSaving,
    modal: blockingModal,
  } = useBlockingAsync(
    (payload: { name: string; type: 'income' | 'expense' }) => {
      setSavingType(payload.type)
      return createCategory(payload)
    },
    {
      successMessage: 'Category created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: categoryKey })
        setUiError(null)
        setName('')
        setSavingType(null)
        onClose()
      },
      onError: error => {
        const mapped = mapApiError(error)
        setUiError(mapped.message)
        setSavingType(null)
      },
      // Note: 'onSettled' equivalent is handled in onSuccess/onError logic or try/finally wrapper inside hook if needed,
      // but here we just reset savingType in both callbacks.
    }
  )

  const handleSave = (type: 'income' | 'expense') => {
    const count = type === 'income' ? incomeCount : expenseCount
    const isLimitReached = typeof limit === 'number' && count >= limit
    if (isLimitReached) {
      setUiError(`${type === 'income' ? 'Income' : 'Expense'} category limit reached (${count}/${limit}).`)
      return
    }
    const trimmed = name.trim()
    if (!trimmed) {
      setUiError('Category name is required')
      return
    }
    setUiError(null)
    executeCreate({ name: trimmed, type })
  }


  const hasLimit = typeof limit === 'number'
  const incomeCount = categories.filter(category => category.type === 'income').length
  const expenseCount = categories.filter(category => category.type === 'expense').length
  const incomeLimitReached = hasLimit && incomeCount >= (limit ?? 0)
  const expenseLimitReached = hasLimit && expenseCount >= (limit ?? 0)
  const incomeLabel = hasLimit ? `Save as income (${incomeCount}/${limit})` : 'Save as income'
  const expenseLabel = hasLimit ? `Save as expense (${expenseCount}/${limit})` : 'Save as expense'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Category"
      subtitle="Give your category a name, then choose whether it tracks income or expenses."
      widthClassName="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-category-name" className="text-sm font-semibold text-[var(--page-fg)]">
            Category name
          </label>
          <input
            id="new-category-name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            disabled={isSaving}
            maxLength={18}
            className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="e.g. Groceries, Rent, Salary"
          />
          {uiError ? <p className="text-xs font-medium text-expense/90">{uiError}</p> : null}
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-3 text-xs text-[var(--text-muted)] backdrop-blur-md">
          <span className="font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Type</span>
          <p>Select whether this category is used for money coming in or going out.</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSave('income')}
            disabled={isSaving || incomeLimitReached}
            className="inline-flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-income px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28A55C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex h-4 w-4 items-center justify-center">
              {isSaving && savingType === 'income' ? <Spinner size="sm" /> : null}
            </span>
            <span>{incomeLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('expense')}
            disabled={isSaving || expenseLimitReached}
            className="inline-flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-expense px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#C63E32] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex h-4 w-4 items-center justify-center">
              {isSaving && savingType === 'expense' ? <Spinner size="sm" /> : null}
            </span>
            <span>{expenseLabel}</span>
          </button>
        </div>
        {hasLimit && (incomeLimitReached || expenseLimitReached) ? (
          <p className="text-center text-xs font-medium text-[var(--text-muted)]">
            {incomeLimitReached && expenseLimitReached
              ? `Income limit reached (${incomeCount}/${limit}). Expense limit reached (${expenseCount}/${limit}).`
              : incomeLimitReached
                ? `Income limit reached (${incomeCount}/${limit}).`
                : `Expense limit reached (${expenseCount}/${limit}).`}
          </p>
        ) : null}
      </div>
      {blockingModal}
    </Modal>
  )
}
