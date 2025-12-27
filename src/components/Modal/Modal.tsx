import React, { useEffect } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: number | string
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  width,
  className = '',
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const modalStyle: React.CSSProperties = width
    ? { width: typeof width === 'number' ? `${width}px` : width }
    : {}

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className={`admin-modal ${className}`} style={modalStyle}>
        {(title !== undefined || onClose !== undefined) && (
          <div className="admin-modal-header">
            {title && <h3 className="admin-modal-title">{title}</h3>}
            {onClose && (
              <button className="admin-modal-close" onClick={() => onClose()}>
                ×
              </button>
            )}
          </div>
        )}
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

