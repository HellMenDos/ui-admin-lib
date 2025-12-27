import React from 'react'

export interface SidebarProps {
  children: React.ReactNode
  className?: string
  width?: number | string
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = '',
  width,
}) => {
  const sidebarClasses = ['admin-sidebar', className].filter(Boolean).join(' ')
  const style: React.CSSProperties = width ? { width: typeof width === 'number' ? `${width}px` : width } : {}

  return (
    <aside className={sidebarClasses} style={style}>
      {children}
    </aside>
  )
}

