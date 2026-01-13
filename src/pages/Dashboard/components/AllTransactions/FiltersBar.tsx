import type { TransactionTypeFilter } from './types'
import { DateRangeFilter } from './filters/DateRangeFilter'
import { TypeFilter } from './filters/TypeFilter'
import { CategoryFilter } from './filters/CategoryFilter'

type FilterValues = {
  startDate: string
  endDate: string
  typeFilter: TransactionTypeFilter
  categoryFilter: string
}

interface FiltersBarProps extends FilterValues {
  categories: {
    id: string
    name: string
    type: 'income' | 'expense'
  }[]
  onChange: (filters: FilterValues) => void
}

export const FiltersBar = ({
  startDate,
  endDate,
  typeFilter,
  categoryFilter,
  categories,
  onChange,
}: FiltersBarProps) => {
  const updateFilters = (overrides: Partial<FilterValues>) => {
    onChange({
      startDate,
      endDate,
      typeFilter,
      categoryFilter,
      ...overrides,
    })
  }

  const handleStartDateChange = (value: string) => {
    updateFilters({ startDate: value })
  }

  const handleEndDateChange = (value: string) => {
    updateFilters({ endDate: value })
  }

  const handleTypeChange = (value: TransactionTypeFilter) => {
    updateFilters({ typeFilter: value, categoryFilter: 'all' })
  }

  const handleCategoryChange = (value: string) => {
    updateFilters({ categoryFilter: value })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onChangeStartDate={handleStartDateChange}
        onChangeEndDate={handleEndDateChange}
      />

      <TypeFilter typeFilter={typeFilter} onChangeType={handleTypeChange} />

      <CategoryFilter
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        onChangeCategory={handleCategoryChange}
      />
    </div>
  )
}

