import { useEffect, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faArrowTrendDown, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { createCategory } from '../../api/categories'
import { mapApiError } from '../../utils/errors'
import { inputStyles } from './settingsStyles'

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
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | null>(null)
  const [uiError, setUiError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (open) {
      setName('')
      setSelectedType(null)
      setUiError(null)
      setCharCount(0)
    }
  }, [open])

  const {
    execute: executeCreate,
    isLoading: isSaving,
    modal: blockingModal,
  } = useBlockingAsync(
    (payload: { name: string; type: 'income' | 'expense' }) => createCategory(payload),
    {
      successMessage: 'Category created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: categoryKey })
        setUiError(null)
        onClose()
      },
      onError: error => setUiError(mapApiError(error).message),
    }
  )

  const handleSave = () => {
    if (!selectedType) return setUiError('Please select a category type.')
    const count = selectedType === 'income' ? incomeCount : expenseCount
    if (typeof limit === 'number' && count >= limit) return setUiError('Category limit reached.')
    
    const trimmed = name.trim()
    if (!trimmed) return setUiError('Category name is required.')
    
    setUiError(null)
    executeCreate({ name: trimmed, type: selectedType })
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setCharCount(value.length)
  }

  const incomeCount = categories.filter(c => c.type === 'income').length
  const expenseCount = categories.filter(c => c.type === 'expense').length
  const incomeLimitReached = !!limit && incomeCount >= limit
  const expenseLimitReached = !!limit && expenseCount >= limit
  const canSubmit = name.trim().length > 0 && selectedType !== null && !isSaving

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Category"
      subtitle="Organize your transactions with custom categories"
      widthClassName="max-w-md"
    >
      <div className="space-y-6 py-2">
        {/* THEME-RESPONSIVE INPUT */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="new-category-name" className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Category Name
            </label>
            <span className={`text-[10px] font-bold tabular-nums transition-colors ${charCount >= 15 ? 'text-orange-500' : 'text-[var(--text-muted)]'}`}>
              {charCount} / 18
            </span>
          </div>
          
          <div className="relative group">
            <input
              id="new-category-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={isSaving}
              maxLength={18}
              autoComplete="off"
              className={`${inputStyles.primary} placeholder:text-[var(--text-subtle)] focus:border-[var(--input-border)] focus:ring-0 focus:ring-transparent disabled:opacity-50`}
              placeholder="e.g. Monthly Rent, Freelance..."
            />
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {uiError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
            <p className="text-xs font-semibold text-rose-500 dark:text-rose-400">{uiError}</p>
          </div>
        )}

        {/* TYPE SELECTION CARDS */}
        <div className="space-y-3">
          <label className="px-1 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Select Type</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Income Card */}
            <button
              type="button"
              onClick={() => !incomeLimitReached && setSelectedType('income')}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                selectedType === 'income'
                  ? 'border-income/40 bg-income/10 shadow-sm'
                  : 'border-[var(--border-glass)] bg-[var(--surface-glass)] hover:border-income/30 hover:bg-income/5'
              } ${incomeLimitReached ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-income/30 transition-colors ${
                  selectedType === 'income' ? 'bg-income text-white' : 'bg-income/10 text-income'
                }`}
              >
                <FontAwesomeIcon icon={faArrowTrendUp} />
              </div>
              <div className="text-center">
                <span className={`text-xs font-bold ${selectedType === 'income' ? 'text-income' : 'text-[var(--page-fg)]'}`}>Income</span>
                {limit && <div className="text-[10px] font-medium text-[var(--text-muted)]">{incomeCount}/{limit}</div>}
              </div>
            </button>

            {/* Expense Card */}
            <button
              type="button"
              onClick={() => !expenseLimitReached && setSelectedType('expense')}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                selectedType === 'expense'
                  ? 'border-expense/40 bg-expense/10 shadow-sm'
                  : 'border-[var(--border-glass)] bg-[var(--surface-glass)] hover:border-expense/30 hover:bg-expense/5'
              } ${expenseLimitReached ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-expense/30 transition-colors ${
                  selectedType === 'expense' ? 'bg-expense text-white' : 'bg-expense/10 text-expense'
                }`}
              >
                <FontAwesomeIcon icon={faArrowTrendDown} />
              </div>
              <div className="text-center">
                <span className={`text-xs font-bold ${selectedType === 'expense' ? 'text-expense' : 'text-[var(--page-fg)]'}`}>Expense</span>
                {limit && <div className="text-[10px] font-medium text-[var(--text-muted)]">{expenseCount}/{limit}</div>}
              </div>
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSubmit}
          className={`relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold text-white transition-all shadow-[0_16px_40px_-24px_rgba(15,23,42,0.35)] active:scale-[0.98] ${
            !canSubmit 
              ? 'bg-[var(--text-muted)]/20 text-[var(--text-muted)] cursor-not-allowed' 
              : selectedType === 'income' 
              ? 'bg-income hover:opacity-90' 
              : 'bg-expense hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isSaving ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faPlus} className="text-xs" />}
            <span>{isSaving ? 'Creating...' : 'Create Category'}</span>
          </div>
        </button>
      </div>
      {blockingModal}
    </Modal>
  )
}
