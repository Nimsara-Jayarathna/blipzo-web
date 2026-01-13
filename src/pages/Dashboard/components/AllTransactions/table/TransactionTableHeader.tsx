const headerRowClasses =
  'text-[10px] uppercase tracking-[0.3em] text-[var(--text-subtle)] border-b border-[var(--border-glass)] bg-[var(--surface-glass)] backdrop-blur-md'

const headerCellClasses = 'px-4 py-3 text-left text-[11px] font-semibold text-[var(--page-fg)]'
const headerCellRightAlignedClasses = 'px-4 py-3 text-right text-[11px] font-semibold text-[var(--page-fg)]'

export const TransactionTableHeader = () => (
  <thead>
    <tr className={headerRowClasses}>
      <th className={headerCellClasses}>Date</th>
      <th className={headerCellClasses}>Category</th>
      <th className={headerCellRightAlignedClasses}>Amount</th>
      <th className={`${headerCellClasses} hidden md:table-cell`}>Note</th>
      <th className={headerCellRightAlignedClasses} aria-label="Delete" />
    </tr>
  </thead>
)
