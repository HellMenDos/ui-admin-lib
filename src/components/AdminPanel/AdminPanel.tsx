import React, { useState, useEffect } from 'react'
import { PageLayout } from '../Layout/PageLayout'
import { Header } from '../Layout/Header'
import { Sidebar } from '../Layout/Sidebar'
import { LoginForm } from '../Form/LoginForm'
import { Menu } from '../Navigation/Menu'
import type { MenuItem } from '../Navigation/Menu'
import { CrudList } from '../CRUD/CrudList'
import { CrudForm } from '../CRUD/CrudForm'
import { Modal } from '../Modal/Modal'
import { Button } from '../Form/Button'
import { CrudService } from '../../utils/crud'
import type { Column } from '../Table/DataTable'
import type { FormField } from '../CRUD/CrudForm'

export interface AdminModel<T = any> {
  name: string
  label: string
  service: CrudService<T>
  columns: Column<T>[]
  fields: FormField[]
  getItemId?: (item: T) => string | number
}

export interface AdminConfig {
  title?: string
  logo?: React.ReactNode
  models: AdminModel[]
  login?: {
    onSubmit: (username: string, password: string) => Promise<void> | void
  }
  user?: {
    name?: string
    onLogout?: () => void
  }
}

export const AdminPanel: React.FC<AdminConfig> = ({
  title = 'Админ панель',
  logo,
  models,
  login,
  user,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentModel, setCurrentModel] = useState<AdminModel | null>(models[0] || null)
  const [formModal, setFormModal] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    item?: any | null
  }>({ open: false, mode: 'create', item: null })
  const [refreshKey, setRefreshKey] = useState(0)

  const handleLogin = async (username: string, password: string) => {
    if (!login) return

    setLoading(true)
    setError(null)

    try {
      await login.onSubmit(username, password)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentModel(models[0] || null)
    setFormModal({ open: false, mode: 'create', item: null })
    if (user?.onLogout) {
      user.onLogout()
    }
  }

  const handleCreate = () => {
    setFormModal({ open: true, mode: 'create', item: null })
  }

  const handleEdit = (item: any) => {
    setFormModal({ open: true, mode: 'edit', item })
  }

  const handleFormSubmit = async (values: any) => {
    if (!currentModel) return

    try {
      setLoading(true)
      setError(null)

      if (formModal.mode === 'create') {
        await currentModel.service.create(values)
      } else if (formModal.item) {
        const id = currentModel.getItemId
          ? currentModel.getItemId(formModal.item)
          : (formModal.item as any).id
        await currentModel.service.update(id, values)
      }

      setFormModal({ open: false, mode: 'create', item: null })
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated && login) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--admin-bg)',
        }}
      >
        <LoginForm onSubmit={handleLogin} loading={loading} error={error || undefined} />
      </div>
    )
  }

  const handleModelSwitch = (model: AdminModel) => {
    setCurrentModel(model)
    setFormModal({ open: false, mode: 'create', item: null })
  }

  const menuItems: MenuItem[] = models.map((model) => ({
    key: model.name,
    label: model.label,
    active: currentModel?.name === model.name,
    onClick: () => handleModelSwitch(model),
  }))

  return (
    <PageLayout
      header={
        <Header logo={logo || title}>
          {user && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
              {user.name && <span>{user.name}</span>}
              <Button variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          )}
        </Header>
      }
      sidebar={
        <Sidebar>
          <Menu items={menuItems} />
        </Sidebar>
      }
    >
      {currentModel && (
        <>
          <CrudList
            key={currentModel.name}
            service={currentModel.service}
            columns={currentModel.columns}
            title={currentModel.label}
            onCreate={handleCreate}
            onEdit={handleEdit}
            getItemId={currentModel.getItemId}
            refreshKey={refreshKey}
          />

          <Modal
            open={formModal.open}
            onClose={() => setFormModal({ open: false, mode: 'create', item: null })}
            title={formModal.mode === 'create' ? `Создать ${currentModel.label}` : `Редактировать ${currentModel.label}`}
            width={600}
          >
            <CrudForm
              fields={currentModel.fields}
              initialValues={formModal.item || {}}
              onSubmit={handleFormSubmit}
              onCancel={() => setFormModal({ open: false, mode: 'create', item: null })}
              loading={loading}
              submitLabel={formModal.mode === 'create' ? 'Создать' : 'Сохранить'}
            />
          </Modal>
        </>
      )}
    </PageLayout>
  )
}

