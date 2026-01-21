import { useState, useEffect } from 'react'
interface CategoryTile {
  id: string
  name: string
  type: 'income' | 'expense'
  isDefault?: boolean
}

interface CategoryTilesProps {
  categories: CategoryTile[]
  selectedCategoryId: string
  isLoading: boolean
  onSelectCategory: (id: string) => void
}

export const CategoryTiles = ({ categories, selectedCategoryId, isLoading, onSelectCategory }: CategoryTilesProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Reset expansion when filtered categories change significantly (optional, but good UX if switching types)
  useEffect(() => {
    setIsExpanded(false)
  }, [categories.map(c => c.id).join(',')])

  if (isLoading) {
    return (
      <p className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-2 text-xs text-[var(--text-muted)] backdrop-blur-md">
        Loading categories...
      </p>
    )
  }

  if (!categories.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-2 text-xs text-[var(--text-muted)] backdrop-blur-md">
        No categories for this type. Create one in Settings first.
      </p>
    )
  }

  const INITIAL_LIMIT = 10
  const showExpandButton = categories.length > INITIAL_LIMIT
  const visibleCategories = isExpanded ? categories : categories.slice(0, INITIAL_LIMIT)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {visibleCategories.map(category => {
          const isSelected = selectedCategoryId === category.id
          const isDefaultForType = Boolean(category.isDefault)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`relative flex h-full min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 text-center text-xs font-medium transition ${isSelected
                ? 'border-accent bg-accent text-white shadow-md'
                : 'border-[var(--border-glass)] bg-[var(--surface-glass)] text-[var(--text-muted)] hover:border-accent/40 hover:text-[var(--page-fg)]'
                }`}
            >
              {isSelected && (
                <span className="absolute right-1 top-1 text-[9px] leading-none opacity-80">✓</span>
              )}
              <span className="w-full truncate px-1 leading-tight">{category.name}</span>
              {isDefaultForType && (
                <span
                  className="absolute left-1 top-1 text-[9px] leading-none text-yellow-400"
                  title="Default category"
                >
                  ★
                </span>
              )}
            </button>
          )
        })}
      </div>

      {showExpandButton && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mx-auto flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-1.5 text-xs font-medium text-[var(--text-subtle)] transition hover:border-accent/30 hover:text-[var(--page-fg)] hover:bg-[var(--surface-glass-thick)]"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <span className="text-[10px]">↑</span>
            </>
          ) : (
            <>
              <span>Show More ({categories.length - INITIAL_LIMIT})</span>
              <span className="text-[10px]">↓</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

