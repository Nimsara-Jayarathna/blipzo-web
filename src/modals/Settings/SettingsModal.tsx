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
      bodyScroll
      bodyClassName="flex-1 max-h-none overflow-y-auto"
      containerClassName="items-start p-2 sm:items-center sm:p-6"
      panelClassName="flex max-h-[calc(100svh-16px)] w-[calc(100vw-16px)] flex-col rounded-2xl px-4 pb-3 pt-4 sm:h-auto sm:max-h-none sm:w-full sm:rounded-[34px] sm:px-10 sm:pb-8 sm:pt-10"
    >
      <div className="flex min-h-0 flex-col gap-4 md:grid md:min-h-[520px] md:grid-cols-[220px_1fr] md:gap-6">
        <nav className="flex w-full gap-2 overflow-x-auto pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] md:flex-col md:gap-2 md:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all sm:text-sm sm:tracking-normal md:justify-start md:rounded-2xl md:px-4 md:py-3 md:text-sm ${
                activeTab === tab.id
                  ? 'bg-[var(--surface-glass-thick)] text-[var(--accent)] border-[var(--border-glass)] shadow-soft'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-glass-thick)] hover:text-[var(--page-fg)]'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[var(--accent)]' : ''} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-0 sm:rounded-3xl sm:border sm:border-[var(--border-glass)] sm:bg-[var(--surface-glass)]/30 sm:p-6">
          <div className="flex-1 overflow-y-auto pr-0 sm:pr-1">
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
      </div>
    </Modal>
  )
}
