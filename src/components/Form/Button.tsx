import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'success' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'admin-button'
  const variantClass = variant !== 'default' ? `admin-button-${variant}` : ''
  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ')

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '4px 12px', fontSize: '12px' },
    medium: {},
    large: { padding: '12px 24px', fontSize: '16px' },
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      style={sizeStyles[size]}
      {...props}
    >
      {loading && <span className="admin-loading-spinner" style={{ marginRight: '8px' }} />}
      {children}
    </button>
  )
}

