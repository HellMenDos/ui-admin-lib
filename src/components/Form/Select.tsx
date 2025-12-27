import React from 'react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  error?: boolean
  label?: string
  helperText?: string
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({
  options,
  error = false,
  label,
  helperText,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  const selectClasses = ['admin-select', error && 'admin-input-error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={selectId} className="admin-label">
          {label}
        </label>
      )}
      <select id={selectId} className={selectClasses} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: error ? 'var(--admin-error)' : 'var(--admin-text-secondary)' }}>
          {helperText}
        </div>
      )}
    </div>
  )
}

