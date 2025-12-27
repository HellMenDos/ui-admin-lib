import React, { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  type?: ToastType
  title?: string
  message: string
  duration?: number
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!visible) return null

  const toastClasses = ['admin-toast-item', `admin-toast-${type}`].filter(Boolean).join(' ')

  return (
    <div className={toastClasses}>
      <div className="admin-toast-content">
        {title && <div className="admin-toast-title">{title}</div>}
        <div className="admin-toast-message">{message}</div>
      </div>
      {onClose && (
        <button className="admin-toast-close" onClick={() => { setVisible(false); onClose() }}>
          ×
        </button>
      )}
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="admin-toast">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

