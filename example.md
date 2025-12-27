# Примеры использования

## Базовый пример

```tsx
import React from 'react'
import {
  PageLayout,
  Header,
  Sidebar,
  Content,
  Button,
  Input,
  Card,
  Menu
} from 'ui-admin-lib'

function App() {
  const menuItems = [
    { key: '1', label: 'Главная', href: '/' },
    { key: '2', label: 'Пользователи', href: '/users' },
    { key: '3', label: 'Настройки', href: '/settings' },
  ]

  return (
    <PageLayout
      header={<Header logo="Admin Panel">Header Content</Header>}
      sidebar={
        <Sidebar>
          <Menu items={menuItems} />
        </Sidebar>
      }
    >
      <Card title="Пример формы">
        <Input label="Имя пользователя" placeholder="Введите имя" />
        <Button variant="primary" style={{ marginTop: '16px' }}>
          Сохранить
        </Button>
      </Card>
    </PageLayout>
  )
}
```

## Таблица данных

```tsx
import { DataTable, Badge } from 'ui-admin-lib'

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id' },
  { key: 'name', title: 'Имя', dataIndex: 'name' },
  { 
    key: 'status', 
    title: 'Статус',
    render: (value) => <Badge variant={value === 'active' ? 'success' : 'error'}>
      {value}
    </Badge>
  },
]

const data = [
  { id: 1, name: 'Иван', status: 'active' },
  { id: 2, name: 'Мария', status: 'inactive' },
]

<DataTable columns={columns} data={data} />
```

## Модальное окно

```tsx
import { Modal, Button } from 'ui-admin-lib'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Подтверждение"
  footer={
    <>
      <Button onClick={() => setOpen(false)}>Отмена</Button>
      <Button variant="primary" onClick={handleConfirm}>
        Подтвердить
      </Button>
    </>
  }
>
  Вы уверены, что хотите удалить этот элемент?
</Modal>
```

