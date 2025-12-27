import React from 'react'

export interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
  style,
}) => {
  const cardClasses = ['admin-card', className].filter(Boolean).join(' ')

  return (
    <div className={cardClasses} style={style}>
      {title && (
        <div className="admin-card-header">
          <h3 className="admin-card-title">{title}</h3>
        </div>
      )}
      <div className="admin-card-body">{children}</div>
      {footer && <div className="admin-card-footer">{footer}</div>}
    </div>
  )
}

