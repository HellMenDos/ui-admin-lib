import React from 'react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  const checkboxClasses = ['admin-checkbox', className].filter(Boolean).join(' ')

  return (
    <label htmlFor={checkboxId} className={checkboxClasses}>
      <input
        type="checkbox"
        id={checkboxId}
        className="admin-checkbox-input"
        {...props}
      />
      <span className="admin-checkbox-box" />
      {label && <span className="admin-checkbox-label">{label}</span>}
    </label>
  )
}

