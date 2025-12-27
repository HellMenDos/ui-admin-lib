import React from 'react'
import { Input } from '../Form/Input'
import { Select } from '../Form/Select'
import { Textarea } from '../Form/Textarea'
import { Checkbox } from '../Form/Checkbox'
import { Radio } from '../Form/Radio'
import { Button } from '../Form/Button'
import { Card } from '../Card/Card'

export interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: Array<{ value: string | number; label: string }>
  required?: boolean
  placeholder?: string
  disabled?: boolean
  value?: any
}

export interface CrudFormProps<T = any> {
  fields: FormField[]
  initialValues?: Partial<T>
  onSubmit: (values: Partial<T>) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  title?: string
  submitLabel?: string
  cancelLabel?: string
  className?: string
}

export function CrudForm<T = any>({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  title,
  submitLabel = 'Сохранить',
  cancelLabel = 'Отмена',
  className = '',
}: CrudFormProps<T>) {
  const [values, setValues] = React.useState<Record<string, any>>(initialValues || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    setValues(initialValues || {})
  }, [initialValues])

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} обязателен для заполнения`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await onSubmit(values as Partial<T>)
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      label: field.label,
      error: !!errors[field.name],
      helperText: errors[field.name],
      disabled: loading || field.disabled,
      required: field.required,
      placeholder: field.placeholder,
    }

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            key={field.name}
            {...commonProps}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        )

      case 'select':
        return (
          <Select
            key={field.name}
            {...commonProps}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            options={field.options || []}
          />
        )

      case 'checkbox':
        return (
          <div key={field.name} style={{ marginBottom: '16px' }}>
            <Checkbox
              {...commonProps}
              checked={!!values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
            />
          </div>
        )

      case 'radio':
        return (
          <div key={field.name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {field.label}
              {field.required && <span style={{ color: 'var(--admin-error)' }}> *</span>}
            </label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {field.options?.map((option) => (
                <Radio
                  key={option.value}
                  name={field.name}
                  label={option.label}
                  checked={values[field.name] === option.value}
                  onChange={() => handleChange(field.name, option.value)}
                  disabled={loading || field.disabled}
                />
              ))}
            </div>
            {errors[field.name] && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--admin-error)' }}>
                {errors[field.name]}
              </div>
            )}
          </div>
        )

      default:
        return (
          <Input
            key={field.name}
            {...commonProps}
            type={field.type || 'text'}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            style={{ marginBottom: '16px' }}
          />
        )
    }
  }

  return (
    <Card title={title} className={className}>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button type="button" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}

