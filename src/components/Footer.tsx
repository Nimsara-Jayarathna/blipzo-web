export const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-[var(--border-glass)] bg-[var(--surface-glass)] py-6 text-center backdrop-blur-md sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 px-6 text-xs text-[var(--text-muted)] sm:flex-row sm:justify-between sm:gap-2 sm:text-sm">
        <span>© 2026 Blipzo. All rights reserved.</span>
        <span className="text-[11px] font-medium text-[var(--text-subtle)] opacity-70 sm:text-xs">v1.1.0</span>
      </div>
    </footer>
  )
}
