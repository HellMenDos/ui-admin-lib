import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children: React.ReactNode
}

export const Label: React.FC<LabelProps> = ({
  required = false,
  children,
  className = '',
  ...props
}) => {
  const labelClasses = ['admin-label', required && 'admin-label-required', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={labelClasses} {...props}>
      {children}
    </label>
  )
}

