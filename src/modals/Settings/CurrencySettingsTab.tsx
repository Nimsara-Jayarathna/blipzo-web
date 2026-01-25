import { CurrencySelector } from '../../pages/Dashboard/components/Profile/CurrencySelector'

export const CurrencySettingsTab = () => {
    return (
        <div className="space-y-6">
            <section>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Currency Preferences</h2>
                    <p className="text-sm text-[var(--text-muted)]">Choose your preferred currency for display.</p>
                </div>
                <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-gradient-to-br from-[var(--surface-glass)] to-[var(--surface-glass)]/30 p-1 transition-all hover:border-[var(--border-glass-strong)] hover:shadow-lg hover:shadow-black/5">
                    <div className="relative rounded-[1.4rem] bg-[var(--page-bg)]/40 p-6 backdrop-blur-xl">
                        <CurrencySelector />
                    </div>
                </div>
            </section>
        </div>
    )
}
