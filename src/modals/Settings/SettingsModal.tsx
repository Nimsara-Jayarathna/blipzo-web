import { useMemo, useState } from 'react'
import { Modal } from '../../components/Modal'
import { SettingsCategoriesTab } from './SettingsCategoriesTab'
import { CurrencySettingsTab } from './CurrencySettingsTab'
import { SecuritySettingsTab } from './SecuritySettingsTab'
import { ProfileSettingsTab } from './ProfileSettingsTab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faTags, faShieldHalved, faUser } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { AnimatePresence, motion } from 'framer-motion'
import { TabNavigation } from '../../components/TabNavigation'

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

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettingsTab />
      case 'categories':
        return (
          <SettingsCategoriesTab
            isAddCategoryOpen={isAddCategoryOpen}
            onAddCategoryClose={() => setAddCategoryOpen(false)}
            onAddCategoryOpen={() => setAddCategoryOpen(true)}
          />
        )
      case 'currency':
        return <CurrencySettingsTab />
      case 'security':
        return <SecuritySettingsTab />
      default:
        return null
    }
  }, [activeTab, isAddCategoryOpen])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Settings"
      subtitle="Manage your account preferences."
      widthClassName="max-w-4xl"
      bodyScroll={false}
      bodyClassName="flex min-h-0 flex-1 flex-col"
      panelClassName="flex h-[90vh] w-full flex-col md:h-[600px]"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="hidden md:block">
          <TabNavigation
            tabs={tabs.map(tab => ({
              id: tab.id,
              label: tab.label,
              icon: <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />,
            }))}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mx-auto w-full max-w-[700px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="relative min-h-full"
                >
                  {activeContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label="Settings sections"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-[var(--border-glass)] bg-[var(--surface-glass)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 py-3 text-[var(--text-muted)]"
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${isActive
                  ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
                  : 'text-[var(--text-muted)]'
                  }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />
              </span>
              <span className={`text-xs font-medium ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </Modal>
  )
}
