import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { SettingsCategoriesTab } from './SettingsCategoriesTab'
import { CurrencySettingsTab } from './CurrencySettingsTab'
import { SecuritySettingsTab } from './SecuritySettingsTab'
import { ProfileSettingsTab } from './ProfileSettingsTab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faTags, faShieldHalved, faUser } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

type SettingsTab = 'profile' | 'categories' | 'currency' | 'security'

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isAddCategoryOpen, setAddCategoryOpen] = useState(false)

  const tabs: { id: SettingsTab; label: string; icon: IconDefinition }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: faUser,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: faTags,
    },
    {
      id: 'currency',
      label: 'Currency',
      icon: faCoins,
    },
    {
      id: 'security',
      label: 'Security',
      icon: faShieldHalved,
    },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Settings"
      widthClassName="max-w-4xl"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-glass-thick)] hover:text-[var(--page-fg)]'
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} className={activeTab === tab.id ? 'text-white' : ''} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/30 p-6">
          {activeTab === 'profile' ? (
            <ProfileSettingsTab />
          ) : activeTab === 'categories' ? (
            <SettingsCategoriesTab
              isAddCategoryOpen={isAddCategoryOpen}
              onAddCategoryClose={() => setAddCategoryOpen(false)}
              onAddCategoryOpen={() => setAddCategoryOpen(true)}
            />
          ) : activeTab === 'currency' ? (
            <CurrencySettingsTab />
          ) : activeTab === 'security' ? (
            <SecuritySettingsTab />
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
