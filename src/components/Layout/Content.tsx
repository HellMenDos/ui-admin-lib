import React from 'react'

export interface ContentProps {
  children: React.ReactNode
  className?: string
}

export const Content: React.FC<ContentProps> = ({
  children,
  className = '',
}) => {
  const contentClasses = ['admin-content', className].filter(Boolean).join(' ')

  return (
    <main className={contentClasses}>
      {children}
    </main>
  )
}

