import React from 'react'

export interface LoadingProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'medium',
  className = '',
}) => {
  const loadingClasses = ['admin-loading', className].filter(Boolean).join(' ')

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { width: '16px', height: '16px', borderWidth: '2px' },
    medium: { width: '20px', height: '20px', borderWidth: '2px' },
    large: { width: '32px', height: '32px', borderWidth: '3px' },
  }

  return (
    <div className={loadingClasses}>
      <div className="admin-loading-spinner" style={sizeStyles[size]} />
      {text && <span className="admin-loading-text">{text}</span>}
    </div>
  )
}

