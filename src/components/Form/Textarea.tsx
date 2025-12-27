import React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  label?: string
  helperText?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  error = false,
  label,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const textareaClasses = ['admin-textarea', error && 'admin-input-error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={textareaId} className="admin-label">
          {label}
        </label>
      )}
      <textarea id={textareaId} className={textareaClasses} {...props} />
      {helperText && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: error ? 'var(--admin-error)' : 'var(--admin-text-secondary)' }}>
          {helperText}
        </div>
      )}
    </div>
  )
}

