import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import type { AllTransactionsPageProps, Grouping, SortDirection, SortField, TransactionTypeFilter } from './types'
import { Spinner } from '../../../../components/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { TransactionTable } from './TransactionTable'
import { useAllTransactionsCategories } from './hooks/useAllTransactionsCategories'
import { useGroupedTransactions } from './hooks/useGroupedTransactions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faChartPie,
  faChevronDown,
  faLayerGroup,
  faMagnifyingGlass,
  faTag,
  faArrowsUpDown,
  faFilterCircleXmark,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../../../../components/Modal'
import { BlockingModal, type BlockingState } from '../../../../components/BlockingModal'

const typeOptions: { type: TransactionTypeFilter; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'income', label: 'Inc' },
  { type: 'expense', label: 'Exp' },
]

type DropdownOption = {
  value: string
  label: string
  tone?: 'income' | 'expense'
}

const SidebarDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const ref = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const selected = options.find(option => option.value === value) ?? options[0]

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase()
    return options.filter(opt => opt.label.toLowerCase().includes(query))
  }, [options, searchQuery])

  const showSearch = options.length > 8

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        setOpen(false)
        setSearchQuery('')
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
        {label}
      </p>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="mt-2 flex w-full items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-xs font-semibold text-[var(--page-fg)] shadow-sm backdrop-blur-md transition hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.tone ? (
            <span
              className={`h-2 w-2 rounded-full ${
                selected.tone === 'income' ? 'bg-income' : 'bg-expense'
              }`}
              aria-hidden="true"
            />
          ) : null}
          <span className="truncate">{selected?.label}</span>
        </span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-[10px] text-[var(--text-subtle)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-1)] shadow-[0_22px_50px_-24px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-top-2 duration-200">
          {showSearch && (
            <div className="border-b border-[var(--border-glass)] p-2">
              <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-glass)] px-2 py-1.5">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[10px] text-[var(--text-muted)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-xs text-[var(--page-fg)] placeholder:text-[var(--text-muted)] focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-[var(--text-muted)]">
                No matches found
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setSearchQuery('')
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-xs font-semibold transition hover:bg-[var(--surface-2)] ${
                    value === option.value ? 'bg-accent/10 text-accent' : 'text-[var(--page-fg)]'
                  }`}
                >
                  {option.tone ? (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        option.tone === 'income' ? 'bg-income' : 'bg-expense'
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="truncate">{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const DatePresetButton = ({
  label,
  onClick,
  active,
}: {
  label: string
  onClick: () => void
  active: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
      active
        ? 'bg-accent/20 text-accent'
        : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--surface-glass)] hover:text-[var(--page-fg)]'
    }`}
  >
    {label}
  </button>
)

export const AllTransactionsPage = ({
  transactions,
  isLoading = false,
  filters,
  onFiltersChange,
  onDeleteTransaction,
  isDeleting,
  currency,
  onOpenSummary,
}: AllTransactionsPageProps) => {
  const [grouping, setGrouping] = useState<Grouping>('none')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)
  const [tempGrouping, setTempGrouping] = useState<Grouping>('none')
  const [tempSearchTerm, setTempSearchTerm] = useState('')
  const [selectModal, setSelectModal] = useState<{
    open: boolean
    title: string
    value: string
    options: DropdownOption[]
    onSelect?: (value: string) => void
    showSearch?: boolean
  }>({ open: false, title: '', value: '', options: [] })
  const [selectQuery, setSelectQuery] = useState('')
  const [blockingState, setBlockingState] = useState<BlockingState>('idle')
  const resetTimeoutRef = useRef<number | null>(null)
  const successTimeoutRef = useRef<number | null>(null)

  const { categoriesForType } = useAllTransactionsCategories(filters, onFiltersChange)

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return transactions
    return transactions.filter((transaction) => {
      const categoryLabel =
        typeof transaction.category === 'string'
          ? transaction.category || transaction.categoryName || transaction.title || 'Transaction'
          : transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
      const haystack = [
        categoryLabel,
        transaction.title,
        transaction.categoryName,
        transaction.note,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [transactions, searchTerm])

  const grouped = useGroupedTransactions(filteredTransactions, grouping)

  const categoryOptions: DropdownOption[] = [
    { value: 'all', label: 'All categories' },
    ...categoriesForType.map(category => ({
      value: category.id,
      label: category.name,
      tone: category.type,
    })),
  ]

  const sortOptions: DropdownOption[] = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
  ]

  const directionOptions: DropdownOption[] = [
    { value: 'desc', label: 'Descending ↓' },
    { value: 'asc', label: 'Ascending ↑' },
  ]

  const groupingOptions: DropdownOption[] = [
    { value: 'none', label: 'None' },
    { value: 'month', label: 'Month' },
    { value: 'category', label: 'Category' },
  ]

  const buildDefaultFilters = (): AllTransactionsPageProps['filters'] => ({
    ...filters,
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    typeFilter: 'all',
    categoryFilter: 'all',
    sortField: 'date',
    sortDirection: 'desc',
  })

  const defaultFilters = buildDefaultFilters()

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current)
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (selectModal.open) {
      setSelectQuery('')
    }
  }, [selectModal.open])

  const triggerResetFeedback = (onComplete?: () => void) => {
    setBlockingState('loading')
    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current)
    if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current)
    resetTimeoutRef.current = window.setTimeout(() => {
      setBlockingState('success')
      successTimeoutRef.current = window.setTimeout(() => {
        setBlockingState('idle')
        if (onComplete) onComplete()
      }, 900)
    }, 600)
  }

  const openSelectModal = (next: {
    title: string
    value: string
    options: DropdownOption[]
    onSelect: (value: string) => void
    showSearch?: boolean
  }) => {
    setSelectModal({
      open: true,
      title: next.title,
      value: next.value,
      options: next.options,
      onSelect: next.onSelect,
      showSearch: next.showSearch,
    })
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.startDate !== defaultFilters.startDate || filters.endDate !== defaultFilters.endDate) count++
    if (filters.typeFilter !== 'all') count++
    if (filters.categoryFilter !== 'all') count++
    if (filters.sortField !== 'date' || filters.sortDirection !== 'desc') count++
    if (grouping !== 'none') count++
    if (searchTerm.trim()) count++
    return count
  }, [filters, defaultFilters, grouping, searchTerm])

  const handleResetFilters = () => {
    setSearchTerm('')
    setGrouping('none')
    onFiltersChange(buildDefaultFilters())
    triggerResetFeedback()
  }

  const openMobileFilters = () => {
    setTempFilters(filters)
    setTempGrouping(grouping)
    setTempSearchTerm(searchTerm)
    setMobileFiltersOpen(true)
  }

  const applyMobileFilters = () => {
    setSearchTerm(tempSearchTerm)
    setGrouping(tempGrouping)
    onFiltersChange(tempFilters)
    setMobileFiltersOpen(false)
  }

  const resetMobileFilters = () => {
    const defaults = buildDefaultFilters()
    setTempSearchTerm('')
    setTempGrouping('none')
    setTempFilters(defaults)
    setSearchTerm('')
    setGrouping('none')
    onFiltersChange(defaults)
    triggerResetFeedback(() => setMobileFiltersOpen(false))
  }

  const applyDatePreset = (
    preset: 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'last30Days' | 'last90Days',
    activeFilters: typeof filters,
    onFiltersUpdate: (next: typeof filters) => void,
  ) => {
    let startDate: string
    let endDate: string

    switch (preset) {
      case 'thisMonth':
        startDate = dayjs().startOf('month').format('YYYY-MM-DD')
        endDate = dayjs().endOf('month').format('YYYY-MM-DD')
        break
      case 'lastMonth':
        startDate = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        endDate = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        break
      case 'thisYear':
        startDate = dayjs().startOf('year').format('YYYY-MM-DD')
        endDate = dayjs().endOf('year').format('YYYY-MM-DD')
        break
      case 'lastYear':
        startDate = dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
        endDate = dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
        break
      case 'last30Days':
        startDate = dayjs().subtract(30, 'days').format('YYYY-MM-DD')
        endDate = dayjs().format('YYYY-MM-DD')
        break
      case 'last90Days':
        startDate = dayjs().subtract(90, 'days').format('YYYY-MM-DD')
        endDate = dayjs().format('YYYY-MM-DD')
        break
    }

    onFiltersUpdate({ ...activeFilters, startDate, endDate })
  }

  const isPresetActive = (preset: string, activeFilters: typeof filters) => {
    const presets: Record<string, { start: string; end: string }> = {
      thisMonth: {
        start: dayjs().startOf('month').format('YYYY-MM-DD'),
        end: dayjs().endOf('month').format('YYYY-MM-DD'),
      },
      lastMonth: {
        start: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      },
      thisYear: {
        start: dayjs().startOf('year').format('YYYY-MM-DD'),
        end: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
      lastYear: {
        start: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
      },
      last30Days: {
        start: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
      last90Days: {
        start: dayjs().subtract(90, 'days').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    }
    return (
      presets[preset]?.start === activeFilters.startDate &&
      presets[preset]?.end === activeFilters.endDate
    )
  }

  const typeLabel =
    filters.typeFilter === 'all'
      ? 'All'
      : filters.typeFilter === 'income'
        ? 'Income'
        : 'Expense'
  const categoryLabel =
    categoryOptions.find(option => option.value === filters.categoryFilter)?.label ?? 'All categories'
  const sortLabel = sortOptions.find(option => option.value === filters.sortField)?.label ?? 'Date'
  const directionLabel = filters.sortDirection === 'asc' ? 'Asc' : 'Desc'
  const groupLabel = groupingOptions.find(option => option.value === grouping)?.label ?? 'None'
  const rangeLabel = `${dayjs(filters.startDate).format('MMM D')} – ${dayjs(filters.endDate).format('MMM D')}`
  const isDateDefault =
    filters.startDate === defaultFilters.startDate && filters.endDate === defaultFilters.endDate
  const isCategoryDefault = filters.categoryFilter === 'all'
  const isSortDefault = filters.sortField === defaultFilters.sortField && filters.sortDirection === defaultFilters.sortDirection
  const isGroupDefault = grouping === 'none'

  const renderFilterContent = (
    activeFilters: typeof filters,
    onFiltersUpdate: (next: typeof filters) => void,
    activeGrouping: Grouping,
    onGroupingChange: (next: Grouping) => void,
    activeSearch: string,
    onSearchChange: (next: string) => void,
    mode: 'mobile' | 'desktop',
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-sm text-[var(--page-fg)] backdrop-blur-sm transition-all focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--text-muted)]" />
        <input
          type="search"
          value={activeSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search transactions..."
          className="w-full bg-transparent text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Quick Ranges
        </p>
        <div className="grid grid-cols-2 gap-2">
          <DatePresetButton
            label="This Month"
            onClick={() => applyDatePreset('thisMonth', activeFilters, onFiltersUpdate)}
            active={isPresetActive('thisMonth', activeFilters)}
          />
          <DatePresetButton
            label="Last Month"
            onClick={() => applyDatePreset('lastMonth', activeFilters, onFiltersUpdate)}
            active={isPresetActive('lastMonth', activeFilters)}
          />
          <DatePresetButton
            label="Last 30d"
            onClick={() => applyDatePreset('last30Days', activeFilters, onFiltersUpdate)}
            active={isPresetActive('last30Days', activeFilters)}
          />
          <DatePresetButton
            label="Last 90d"
            onClick={() => applyDatePreset('last90Days', activeFilters, onFiltersUpdate)}
            active={isPresetActive('last90Days', activeFilters)}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Custom Range
        </p>
        <div className="space-y-2">
          <input
            type="date"
            value={activeFilters.startDate}
            onChange={(event) => onFiltersUpdate({ ...activeFilters, startDate: event.target.value })}
            className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-xs text-[var(--page-fg)] transition-all focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
          <input
            type="date"
            value={activeFilters.endDate}
            onChange={(event) => onFiltersUpdate({ ...activeFilters, endDate: event.target.value })}
            className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-xs text-[var(--page-fg)] transition-all focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Type
        </p>
        <div className="inline-flex w-full items-center justify-between rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1">
          {typeOptions.map((option) => {
            const isActive = activeFilters.typeFilter === option.type
            return (
              <button
                key={option.type}
                type="button"
                onClick={() =>
                  onFiltersUpdate({ ...activeFilters, typeFilter: option.type, categoryFilter: 'all' })
                }
                className={`flex-1 rounded-full px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-[0_10px_25px_-18px_rgba(59,130,246,0.8)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--page-fg)]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        {mode === 'desktop' ? (
          <>
            <SidebarDropdown
              label="Category"
              value={activeFilters.categoryFilter}
              options={categoryOptions}
              onChange={(categoryFilter) => onFiltersUpdate({ ...activeFilters, categoryFilter })}
            />
            <SidebarDropdown
              label="Sort By"
              value={activeFilters.sortField}
              options={sortOptions}
              onChange={(sortField) => onFiltersUpdate({ ...activeFilters, sortField: sortField as SortField })}
            />
            <SidebarDropdown
              label="Direction"
              value={activeFilters.sortDirection}
              options={directionOptions}
              onChange={(sortDirection) =>
                onFiltersUpdate({ ...activeFilters, sortDirection: sortDirection as SortDirection })
              }
            />
            <SidebarDropdown
              label="Group By"
              value={activeGrouping}
              options={groupingOptions}
              onChange={(value) => onGroupingChange(value as Grouping)}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                openSelectModal({
                  title: 'Category',
                  value: activeFilters.categoryFilter,
                  options: categoryOptions,
                  onSelect: (categoryFilter) =>
                    onFiltersUpdate({ ...activeFilters, categoryFilter }),
                  showSearch: true,
                })
              }
              className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-left text-xs font-semibold text-[var(--page-fg)]"
            >
              Category · {categoryOptions.find(option => option.value === activeFilters.categoryFilter)?.label ?? 'All categories'}
            </button>
            <button
              type="button"
              onClick={() =>
                openSelectModal({
                  title: 'Sort By',
                  value: activeFilters.sortField,
                  options: sortOptions,
                  onSelect: (sortField) =>
                    onFiltersUpdate({ ...activeFilters, sortField: sortField as SortField }),
                })
              }
              className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-left text-xs font-semibold text-[var(--page-fg)]"
            >
              Sort By · {sortOptions.find(option => option.value === activeFilters.sortField)?.label ?? 'Date'}
            </button>
            <button
              type="button"
              onClick={() =>
                openSelectModal({
                  title: 'Direction',
                  value: activeFilters.sortDirection,
                  options: directionOptions,
                  onSelect: (sortDirection) =>
                    onFiltersUpdate({ ...activeFilters, sortDirection: sortDirection as SortDirection }),
                })
              }
              className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-left text-xs font-semibold text-[var(--page-fg)]"
            >
              Direction · {directionOptions.find(option => option.value === activeFilters.sortDirection)?.label ?? 'Descending'}
            </button>
            <button
              type="button"
              onClick={() =>
                openSelectModal({
                  title: 'Group By',
                  value: activeGrouping,
                  options: groupingOptions,
                  onSelect: (value) => onGroupingChange(value as Grouping),
                })
              }
              className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-left text-xs font-semibold text-[var(--page-fg)]"
            >
              Group By · {groupingOptions.find(option => option.value === activeGrouping)?.label ?? 'None'}
            </button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <section className="grid gap-4 md:grid-cols-[minmax(260px,320px)_1fr] md:gap-6">
      {/* Mobile Search - Always Visible */}
      <div className="md:hidden">
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-3 text-sm text-[var(--page-fg)] backdrop-blur-xl transition-all focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--text-muted)]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-transparent text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Filter Chips */}
      <div className="sticky top-0 z-20 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/95 p-4 shadow-soft backdrop-blur-xl md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-[var(--text-subtle)]">Filters</p>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:text-accent"
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} className="text-[10px]" />
              Reset
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={openMobileFilters}
          className="flex w-full flex-wrap justify-center gap-2 text-xs"
        >
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all ${
              isDateDefault
                ? 'border-[var(--border-glass)] text-[var(--text-muted)]'
                : 'border-accent/40 bg-accent/10 text-accent shadow-sm'
            }`}
          >
            <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
            <span className="whitespace-nowrap">{rangeLabel}</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px] opacity-70" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-glass)] px-3 py-2 text-[var(--text-muted)] transition-all">
            {typeLabel}
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px] opacity-70" />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all ${
              isCategoryDefault
                ? 'border-[var(--border-glass)] text-[var(--text-muted)]'
                : 'border-accent/40 bg-accent/10 text-accent shadow-sm'
            }`}
          >
            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
            <span className="max-w-[120px] truncate">{categoryLabel}</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px] opacity-70" />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all ${
              isSortDefault
                ? 'border-[var(--border-glass)] text-[var(--text-muted)]'
                : 'border-accent/40 bg-accent/10 text-accent shadow-sm'
            }`}
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="text-[10px]" />
            <span className="whitespace-nowrap">{sortLabel} · {directionLabel}</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px] opacity-70" />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all ${
              isGroupDefault
                ? 'border-[var(--border-glass)] text-[var(--text-muted)]'
                : 'border-accent/40 bg-accent/10 text-accent shadow-sm'
            }`}
          >
            <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
            {groupLabel}
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px] opacity-70" />
          </span>
        </button>

        {/* Summary Button - Mobile Only, below filter chips */}
        {onOpenSummary && (
          <button
            type="button"
            onClick={onOpenSummary}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-accent/40 hover:text-[var(--page-fg)]"
          >
            <FontAwesomeIcon icon={faChartPie} />
            View Summary
          </button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-5 shadow-soft backdrop-blur-xl md:sticky md:top-24 md:block md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto">
        {renderFilterContent(filters, onFiltersChange, grouping, setGrouping, searchTerm, setSearchTerm, 'desktop')}
        <div className="mt-4 space-y-3 border-t border-[var(--border-glass)] pt-4">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-accent/40 hover:text-accent"
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
              Reset Filters
            </button>
          )}
          {onOpenSummary && (
            <button
              type="button"
              onClick={onOpenSummary}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-accent/40 hover:text-[var(--page-fg)]"
            >
              <FontAwesomeIcon icon={faChartPie} />
              Summary
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0">
        {isLoading ? (
          <Spinner size="lg" centered />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState 
            title="No transactions found" 
            description={searchTerm ? "Try adjusting your search or filters." : "Adjust filters or add a transaction to see it here."} 
          />
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            grouped={grouped ?? undefined}
            onDeleteTransaction={onDeleteTransaction}
            isDeleting={isDeleting}
            currency={currency}
            hideCategory={grouping === 'category'}
          />
        )}
      </div>

      {/* Mobile Filter Modal - Summary button removed, only Reset and Apply */}
      <Modal
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters & Options"
        subtitle="Customize your transaction view"
        widthClassName="max-w-md"
        footer={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetMobileFilters}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-accent/40 hover:text-accent active:scale-[0.98]"
              >
                <FontAwesomeIcon icon={faFilterCircleXmark} className="text-[10px]" />
                Reset
              </button>
              <button
                type="button"
                onClick={applyMobileFilters}
                className="rounded-2xl bg-accent px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_25px_-18px_rgba(59,130,246,0.8)] transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Apply
              </button>
            </div>
            {onOpenSummary ? (
              <button
                type="button"
                onClick={() => {
                  applyMobileFilters()
                  onOpenSummary()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-all hover:border-accent/40 hover:text-[var(--page-fg)]"
              >
                <FontAwesomeIcon icon={faChartPie} />
                View Summary
              </button>
            ) : null}
          </div>
        }
      >
        <div className={`max-h-[40vh] overflow-y-auto px-1 ${blockingState !== 'idle' ? 'pointer-events-none opacity-60' : ''}`}>
          {renderFilterContent(
            tempFilters,
            setTempFilters,
            tempGrouping,
            setTempGrouping,
            tempSearchTerm,
            setTempSearchTerm,
            'mobile',
          )}
        </div>
        {blockingState !== 'idle' ? (
          <div className="mt-4 flex items-center justify-center rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-3 text-center">
            <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin text-accent" />
            <span className="ml-3 text-sm font-semibold text-[var(--page-fg)]">
              {blockingState === 'loading' ? 'Resetting filters...' : 'Filters reset'}
            </span>
          </div>
        ) : null}
      </Modal>
      {!mobileFiltersOpen ? (
        <BlockingModal
          state={blockingState}
          message={blockingState === 'loading' ? 'Resetting filters...' : 'Filters reset'}
          onClose={() => setBlockingState('idle')}
        />
      ) : null}
      <Modal
        open={selectModal.open}
        onClose={() => setSelectModal(prev => ({ ...prev, open: false }))}
        title={selectModal.title}
        widthClassName="max-w-sm"
        zIndex="z-[80]"
      >
        {selectModal.showSearch ? (
          <div className="mb-4">
            <input
              type="search"
              value={selectQuery}
              onChange={(event) => setSelectQuery(event.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-xs text-[var(--page-fg)] focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        ) : null}
        <div className="max-h-[60vh] space-y-1 overflow-y-auto">
          {selectModal.options
            .filter(option =>
              selectModal.showSearch && selectQuery.trim()
                ? option.label.toLowerCase().includes(selectQuery.trim().toLowerCase())
                : true
            )
            .map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  selectModal.onSelect?.(option.value)
                  setSelectModal(prev => ({ ...prev, open: false }))
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--surface-2)] ${
                  selectModal.value === option.value ? 'bg-accent/10 font-semibold text-accent' : 'text-[var(--page-fg)]'
                }`}
              >
                {option.tone ? (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      option.tone === 'income' ? 'bg-income' : 'bg-expense'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
        </div>
      </Modal>
    </section>
  )
}
