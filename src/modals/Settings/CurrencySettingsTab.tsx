import { CurrencySelector } from '../../pages/Dashboard/components/Profile/CurrencySelector'

export const CurrencySettingsTab = () => {
    return (
        <div className="space-y-6">
            <section>
                <h2 className="mb-4 text-base font-semibold text-[var(--page-fg)]">Currency Preferences</h2>
                <CurrencySelector />
            </section>
        </div>
    )
}
