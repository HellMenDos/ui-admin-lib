import React, { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'

export interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void> | void
  loading?: boolean
  error?: string
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className = '',
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className={`admin-login-form ${className}`} style={{ width: '100%', maxWidth: '400px' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center', color: 'var(--admin-text-primary)' }}>
        Вход в систему
      </h2>
      
      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: 'rgba(255, 77, 79, 0.1)',
          border: '1px solid var(--admin-error)',
          borderRadius: 'var(--admin-border-radius)',
          color: 'var(--admin-error)',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      <Input
        label="Имя пользователя"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
        autoFocus
        style={{ marginBottom: '16px' }}
      />

      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        style={{ marginBottom: '24px' }}
      />

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        style={{ width: '100%' }}
      >
        Войти
      </Button>
    </form>
  )
}

