import { CurrencySelector } from '../../pages/Dashboard/components/Profile/CurrencySelector'

export const CurrencySettingsTab = () => {
    return (
        <div className="space-y-5 sm:space-y-6">
            <section>
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Currency Preferences</h2>
                    <p className="text-sm text-[var(--text-muted)]">Choose your preferred currency for display.</p>
                </div>
                <div className="sm:group sm:relative sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[var(--border-glass)] sm:bg-gradient-to-br sm:from-[var(--surface-glass)] sm:to-[var(--surface-glass)]/30 sm:p-1 sm:transition-all sm:hover:border-[var(--border-glass-strong)] sm:hover:shadow-lg sm:hover:shadow-black/5">
                    <div className="sm:relative sm:rounded-[1.4rem] sm:bg-[var(--page-bg)]/40 sm:p-6 sm:backdrop-blur-xl">
                        <CurrencySelector />
                    </div>
                </div>
            </section>
        </div>
    )
}
