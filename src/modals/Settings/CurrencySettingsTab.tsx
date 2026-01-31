import { CurrencySelector } from '../../pages/Dashboard/components/Profile/CurrencySelector'
import { cardStyles } from './settingsStyles'

export const CurrencySettingsTab = () => {
    return (
        <div className="space-y-4 md:space-y-6">
            <section>
                <div className="mb-4 md:mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Currency Preferences</h2>
                    <p className="text-sm text-[var(--text-muted)]">Choose your preferred currency for display.</p>
                </div>
                <div className={cardStyles.primary}>
                    <CurrencySelector />
                </div>
            </section>
        </div>
    )
}
