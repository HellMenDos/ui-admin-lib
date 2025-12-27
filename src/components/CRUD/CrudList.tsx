import React, { useEffect, useState } from 'react'
import { DataTable } from '../Table/DataTable'
import type { Column } from '../Table/DataTable'
import { Button } from '../Form/Button'
import { Modal } from '../Modal/Modal'
import { Loading } from '../Loading/Loading'
import { CrudService } from '../../utils/crud'

export interface CrudListProps<T = any> {
  service: CrudService<T>
  columns: Column<T>[]
  refreshKey?: number | string
  title?: string
  onCreate?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => Promise<void>
  getItemId?: (item: T) => string | number
  actions?: (item: T) => React.ReactNode
  className?: string
}

export function CrudList<T = any>({
  service,
  columns,
  title,
  onCreate,
  onEdit,
  onDelete,
  getItemId = (item: any) => (item as any).id,
  actions,
  className = '',
  refreshKey,
}: CrudListProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: T | null }>({
    open: false,
    item: null,
  })
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await service.getList()
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  const handleDeleteClick = (item: T) => {
    setDeleteModal({ open: true, item })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return

    try {
      setDeleting(true)
      const id = getItemId(deleteModal.item)
      
      if (onDelete) {
        await onDelete(deleteModal.item)
      } else {
        await service.delete(id)
      }
      
      setDeleteModal({ open: false, item: null })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
    } finally {
      setDeleting(false)
    }
  }

  const columnsWithActions: Column<T>[] = [
    ...columns,
    {
      key: 'actions',
      title: 'Действия',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {onEdit && (
            <Button size="small" onClick={() => onEdit(record)}>
              Редактировать
            </Button>
          )}
          {(onDelete || service) && (
            <Button
              size="small"
              variant="danger"
              onClick={() => handleDeleteClick(record)}
            >
              Удалить
            </Button>
          )}
          {actions && actions(record)}
        </div>
      ),
    },
  ]

  if (loading && data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loading text="Загрузка данных..." />
      </div>
    )
  }

  return (
    <div className={className}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        {title && <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 500 }}>{title}</h1>}
        {onCreate && (
          <Button variant="primary" onClick={onCreate}>
            Создать
          </Button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: 'rgba(255, 77, 79, 0.1)',
          border: '1px solid var(--admin-error)',
          borderRadius: 'var(--admin-border-radius)',
          color: 'var(--admin-error)',
        }}>
          {error}
        </div>
      )}

      <DataTable columns={columnsWithActions} data={data} loading={loading} />

      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Подтверждение удаления"
        footer={
          <>
            <Button onClick={() => setDeleteModal({ open: false, item: null })} disabled={deleting}>
              Отмена
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>
              Удалить
            </Button>
          </>
        }
      >
        Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.
      </Modal>
    </div>
  )
}

