import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Content } from './Content'

export interface PageLayoutProps {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  sidebar,
  children,
  className = '',
}) => {
  const layoutClasses = ['admin-page-layout', className].filter(Boolean).join(' ')

  return (
    <div className={layoutClasses}>
      {header && <>{header}</>}
      <div className="admin-layout-with-sidebar">
        {sidebar && <>{sidebar}</>}
        <Content>{children}</Content>
      </div>
    </div>
  )
}

