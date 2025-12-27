import React from 'react'

export interface HeaderProps {
  logo?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  children,
  className = '',
}) => {
  const headerClasses = ['admin-header', className].filter(Boolean).join(' ')

  return (
    <header className={headerClasses}>
      {logo && <div className="admin-header-logo">{logo}</div>}
      <div className="admin-header-content">{children}</div>
    </header>
  )
}

