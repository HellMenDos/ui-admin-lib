import React from 'react'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const badgeClasses = [
    'admin-badge',
    variant !== 'default' && `admin-badge-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={badgeClasses}>{children}</span>
}

