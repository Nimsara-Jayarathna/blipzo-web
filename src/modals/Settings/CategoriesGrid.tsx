
import { Spinner } from '../../components/Spinner'
import type { Category } from '../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons'

interface CategoriesGridProps {
  isLoading: boolean
  categories: Category[]
  limit?: number
  deleteMutation: {
    isPending: boolean
    variables: unknown
  }
  resolveCategoryId: (category: Category) => string
  onDelete: (category: Category) => void
  onSetDefault: (category: Category) => void
  isSettingDefault: boolean
}

export const CategoriesGrid = ({
  isLoading,
  categories,
  limit,
  deleteMutation,
  resolveCategoryId,
  onDelete,
  onSetDefault,
  isSettingDefault,
}: CategoriesGridProps) => {
  if (isLoading) {
    return <Spinner size="lg" centered />
  }

  const grouped = [
    {
      title: 'Income',
      description: 'Track money coming in.',
      items: categories.filter(item => item.type === 'income'),
      isIncome: true,
      emptyState: "No income categories yet.",
    },
    {
      title: 'Expenses',
      description: 'Track your spending.',
      items: categories.filter(item => item.type === 'expense'),
      isIncome: false,
      emptyState: "No expense categories yet.",
    },
  ]

  return (
    <div className="grid h-full gap-8 overflow-hidden sm:grid-cols-2">
      {grouped.map(column => {
        const countLabel = typeof limit === 'number' ? `${column.items.length}/${limit}` : `${column.items.length}`

        return (
          <div key={column.title} className="flex h-full flex-col gap-4 overflow-hidden">
            <div className="flex shrink-0 items-end justify-between border-b border-[var(--border-glass)] pb-2">
              <div>
                <h3 className="font-semibold text-[var(--page-fg)]">{column.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{column.description}</p>
              </div>
              <span className="text-xs font-medium text-[var(--text-muted)]">
                {countLabel}
              </span>
            </div>

            <ul className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent/10 scrollbar-track-transparent">
              {column.items.length ? (
                column.items.map(category => {
                  const categoryId = resolveCategoryId(category)
                  const isDeleting = deleteMutation.isPending && deleteMutation.variables === categoryId
                  const initials = category.name?.[0]?.toUpperCase() ?? '?'
                  const isDefault = Boolean(category.isDefault)
                  const canDelete = !isDefault

                  return (
                    <li
                      key={categoryId}
                      className="group flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-[var(--surface-glass-thick)]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${column.isIncome
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                            }`}
                        >
                          {initials}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[var(--page-fg)]">{category.name}</span>
                          {category.isDefault && (
                            <span className="text-[10px] text-[var(--text-muted)]">Default</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => onSetDefault(category)}
                          disabled={isDefault || isSettingDefault}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${isDefault
                            ? 'text-yellow-400 opacity-100'
                            : 'text-[var(--text-subtle)] hover:bg-[var(--surface-glass)] hover:text-yellow-400'
                            } disabled:cursor-not-allowed`}
                          title={isDefault ? 'Default category' : 'Set as default'}
                        >
                          <FontAwesomeIcon icon={faStar} className={isDefault ? 'text-sm' : 'text-xs'} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (canDelete) onDelete(category)
                          }}
                          disabled={isDeleting || !canDelete}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${canDelete
                            ? 'text-[var(--text-subtle)] hover:bg-red-500/10 hover:text-red-500'
                            : 'cursor-not-allowed text-[var(--text-subtle)] opacity-50'
                            }`}
                          title={canDelete ? 'Delete category' : 'Cannot delete default'}
                        >
                          {isDeleting ? (
                            <Spinner size="sm" />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          )}
                        </button>
                      </div>
                    </li>
                  )
                })
              ) : (
                <li className="py-8 text-center text-xs text-[var(--text-muted)]">
                  {column.emptyState}
                </li>
              )}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
