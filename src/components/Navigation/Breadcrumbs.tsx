import React from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: string
  className?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  className = '',
}) => {
  const breadcrumbsClasses = ['admin-breadcrumbs', className].filter(Boolean).join(' ')

  return (
    <nav className={breadcrumbsClasses}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const itemClasses = ['admin-breadcrumbs-item', isLast && 'admin-breadcrumbs-item-active']
          .filter(Boolean)
          .join(' ')

        return (
          <React.Fragment key={index}>
            {item.href ? (
              <a href={item.href} className={itemClasses} onClick={item.onClick}>
                {item.label}
              </a>
            ) : (
              <span className={itemClasses} onClick={item.onClick} style={{ cursor: item.onClick ? 'pointer' : 'default' }}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="admin-breadcrumbs-separator">{separator}</span>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

