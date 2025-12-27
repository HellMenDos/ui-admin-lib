import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  label?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  error = false,
  label,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const inputClasses = ['admin-input', error && 'admin-input-error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={inputId} className="admin-label">
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
      {helperText && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: error ? 'var(--admin-error)' : 'var(--admin-text-secondary)' }}>
          {helperText}
        </div>
      )}
    </div>
  )
}

