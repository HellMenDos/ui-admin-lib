import React from 'react'

export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  href?: string
  active?: boolean
}

export interface MenuProps {
  items: MenuItem[]
  className?: string
}

export const Menu: React.FC<MenuProps> = ({
  items,
  className = '',
}) => {
  const menuClasses = ['admin-menu', className].filter(Boolean).join(' ')

  return (
    <ul className={menuClasses}>
      {items.map((item) => {
        const itemClasses = ['admin-menu-item', item.active && 'admin-menu-item-active']
          .filter(Boolean)
          .join(' ')

        const content = (
          <>
            {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
            {item.label}
          </>
        )

        if (item.href) {
          return (
            <li key={item.key} className={itemClasses}>
              <a href={item.href} className="admin-menu-link">
                {content}
              </a>
            </li>
          )
        }

        return (
          <li key={item.key} className={itemClasses} onClick={item.onClick}>
            {content}
          </li>
        )
      })}
    </ul>
  )
}

