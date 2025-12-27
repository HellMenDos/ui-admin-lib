import React from 'react'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Radio: React.FC<RadioProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
  const radioClasses = ['admin-radio', className].filter(Boolean).join(' ')

  return (
    <label htmlFor={radioId} className={radioClasses}>
      <input
        type="radio"
        id={radioId}
        className="admin-radio-input"
        {...props}
      />
      <span className="admin-radio-box" />
      {label && <span className="admin-radio-label">{label}</span>}
    </label>
  )
}

