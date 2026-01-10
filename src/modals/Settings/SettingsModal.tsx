import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { SettingsCategoriesTab } from './SettingsCategoriesTab'
import { ProfileSettingsTab } from './ProfileSettingsTab'
import { TabNavigation } from '../../components/TabNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faTags } from '@fortawesome/free-solid-svg-icons'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

type SettingsTab = 'categories' | 'currency'

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('categories')
  const [isAddCategoryOpen, setAddCategoryOpen] = useState(false)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Settings"
      subtitle="Manage your application preferences and configurations."
      widthClassName="max-w-4xl"
      headerActions={
        activeTab === 'categories' ? (
          <button
            type="button"
            onClick={() => setAddCategoryOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)] backdrop-blur-md transition hover:border-accent/40 hover:text-[var(--page-fg)]"
          >
            <span className="text-base leading-none text-accent">+</span>
            <span>Add category</span>
          </button>
        ) : null
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-center">
          <TabNavigation
            tabs={[
              {
                id: 'categories',
                label: 'Categories',
                icon: <FontAwesomeIcon icon={faTags} className="h-4 w-4" />,
              },
              {
                id: 'currency',
                label: 'Currency',
                icon: <FontAwesomeIcon icon={faCoins} className="h-4 w-4" />,
              },
            ]}
            activeTab={activeTab}
            onChange={id => setActiveTab(id as SettingsTab)}
          />
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'categories' ? (
            <SettingsCategoriesTab
              isAddCategoryOpen={isAddCategoryOpen}
              onAddCategoryClose={() => setAddCategoryOpen(false)}
            />
          ) : activeTab === 'currency' ? (
            <ProfileSettingsTab />
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
