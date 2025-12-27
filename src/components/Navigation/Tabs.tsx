import React, { useState } from 'react'

export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  className = '',
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || items[0]?.key || '')
  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey

  const handleTabClick = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key)
    }
    onChange?.(key)
  }

  const activeTab = items.find((tab) => tab.key === activeKey)

  const tabsClasses = ['admin-tabs', className].filter(Boolean).join(' ')

  return (
    <div className={tabsClasses}>
      <ul className="admin-tabs-list">
        {items.map((item) => {
          const itemClasses = ['admin-tabs-item', item.key === activeKey && 'admin-tabs-item-active']
            .filter(Boolean)
            .join(' ')

          return (
            <li
              key={item.key}
              className={itemClasses}
              onClick={() => !item.disabled && handleTabClick(item.key)}
              style={{ cursor: item.disabled ? 'not-allowed' : 'pointer', opacity: item.disabled ? 0.5 : 1 }}
            >
              {item.label}
            </li>
          )
        })}
      </ul>
      {activeTab && <div className="admin-tabs-content">{activeTab.content}</div>}
    </div>
  )
}

