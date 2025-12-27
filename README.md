# UI Admin Library

Библиотека для быстрого создания административных панелей на React с полным CRUD функционалом. Создайте полноценную админку всего в несколько строк кода!

## Установка

```bash
npm install ui-admin-lib
```

## Использование

Создайте админ-панель в несколько строк:

```tsx
import { AdminPanel, CrudService } from 'ui-admin-lib'
import 'ui-admin-lib/styles'

// 1. Создайте сервис для работы с API
const userService = new CrudService({
  baseUrl: 'https://api.example.com/users',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// 2. Определите модель
const userModel = {
  name: 'users',
  label: 'Пользователи',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Имя', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ],
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ],
}

// 3. Используйте AdminPanel
function App() {
  return (
    <AdminPanel
      title="Моя админка"
      models={[userModel]}
      login={{
        onSubmit: async (username, password) => {
          // Ваша логика авторизации
        },
      }}
    />
  )
}
```

Всё! AdminPanel автоматически создаст:
- Страницу входа
- Боковую навигацию
- Таблицы с данными
- Формы для создания/редактирования
- Полный CRUD функционал

## Полный пример конфигурации

Вот полный пример с несколькими моделями и всеми возможностями:

```tsx
import { AdminPanel, CrudService, AdminModel } from 'ui-admin-lib'
import type { Column, FormField } from 'ui-admin-lib'
import 'ui-admin-lib/styles'

// Типы данных
interface User {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

interface Product {
  id: number
  title: string
  price: number
  category: string
  inStock: boolean
}

// Создание сервисов для работы с API
const userService = new CrudService<User>({
  baseUrl: 'https://api.example.com/users',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  // Опционально: кастомные URL для операций
  getListUrl: () => 'https://api.example.com/users',
  getDetailUrl: (id) => `https://api.example.com/users/${id}`,
  getCreateUrl: () => 'https://api.example.com/users',
  getUpdateUrl: (id) => `https://api.example.com/users/${id}`,
  getDeleteUrl: (id) => `https://api.example.com/users/${id}`,
  // Опционально: трансформация данных
  transformRequest: (data) => data, // Преобразование перед отправкой
  transformResponse: (data) => data, // Преобразование после получения
})

const productService = new CrudService<Product>({
  baseUrl: 'https://api.example.com/products',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// Конфигурация модели пользователей
const userModel: AdminModel<User> = {
  name: 'users',
  label: 'Пользователи',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Имя', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    {
      key: 'role',
      title: 'Роль',
      dataIndex: 'role',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      key: 'active',
      title: 'Активен',
      dataIndex: 'active',
      render: (value) => (value ? 'Да' : 'Нет'),
    },
  ] as Column<User>[],
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true, placeholder: 'Введите имя' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Введите email' },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Администратор' },
        { value: 'user', label: 'Пользователь' },
      ],
    },
    { name: 'active', label: 'Активен', type: 'checkbox' },
  ] as FormField[],
  // Опционально: кастомная функция получения ID
  getItemId: (item) => item.id,
}

// Конфигурация модели товаров
const productModel: AdminModel<Product> = {
  name: 'products',
  label: 'Товары',
  service: productService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'title', title: 'Название', dataIndex: 'title' },
    {
      key: 'price',
      title: 'Цена',
      dataIndex: 'price',
      render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
    },
    { key: 'category', title: 'Категория', dataIndex: 'category' },
    {
      key: 'inStock',
      title: 'В наличии',
      dataIndex: 'inStock',
      render: (value) => (value ? 'Да' : 'Нет'),
    },
  ] as Column<Product>[],
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    { name: 'price', label: 'Цена', type: 'number', required: true },
    { name: 'category', label: 'Категория', type: 'text', required: true },
    { name: 'inStock', label: 'В наличии', type: 'checkbox' },
  ] as FormField[],
}

// Использование
function App() {
  return (
    <AdminPanel
      title="Админ панель"
      logo={<span>Мой Логотип</span>} // Опционально: кастомный логотип
      models={[userModel, productModel]}
      login={{
        onSubmit: async (username, password) => {
          // Ваша логика авторизации
          const response = await fetch('https://api.example.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })
          if (!response.ok) {
            throw new Error('Неверное имя пользователя или пароль')
          }
          const data = await response.json()
          // Сохраните токен
          localStorage.setItem('token', data.token)
        },
      }}
      user={{
        name: 'Администратор', // Опционально: имя пользователя в header
        onLogout: () => {
          // Опционально: обработчик выхода
          localStorage.removeItem('token')
        },
      }}
    />
  )
}
```

## Типы полей форм

Поддерживаются следующие типы полей в `FormField`:

- `text` - Текстовое поле
- `email` - Email поле
- `number` - Числовое поле
- `password` - Поле пароля
- `textarea` - Многострочное поле
- `select` - Выпадающий список (требует `options`)
- `checkbox` - Чекбокс
- `radio` - Радиокнопки (требует `options`)

Пример конфигурации поля:

```tsx
{
  name: 'fieldName',           // Имя поля (обязательно)
  label: 'Метка поля',          // Метка поля (обязательно)
  type: 'text',                 // Тип поля (опционально, по умолчанию 'text')
  required: true,               // Обязательное поле (опционально)
  placeholder: 'Подсказка',     // Подсказка (опционально)
  disabled: false,              // Отключено (опционально)
  options: [                    // Опции для select/radio (обязательно для этих типов)
    { value: 'value1', label: 'Метка 1' },
    { value: 'value2', label: 'Метка 2' },
  ],
}
```

## Быстрый старт

```bash
npm install ui-admin-lib
```

```tsx
import { AdminPanel, CrudService } from 'ui-admin-lib'
import 'ui-admin-lib/styles'

const userService = new CrudService({
  baseUrl: 'https://api.example.com/users',
})

const userModel = {
  name: 'users',
  label: 'Пользователи',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Имя', dataIndex: 'name' },
  ],
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true },
  ],
}

function App() {
  return <AdminPanel models={[userModel]} />
}
```

## Демо приложение

Запустите демо приложение для просмотра всех возможностей:

```bash
git clone <repository-url>
cd ui-admin-lib
npm install
npm run demo
```

Откройте http://localhost:3000 в браузере.

**Вход:**
- Логин: `admin`
- Пароль: `admin`

## Основные компоненты

### AdminPanel
Главный компонент для создания админ-панели. Принимает конфигурацию и автоматически создает:
- Страницу входа
- Боковую навигацию
- Таблицы с данными
- Формы создания/редактирования
- Операции CRUD (Create, Read, Update, Delete)

### CrudService
Утилита для работы с REST API. Поддерживает любые форматы ответов API.

### Низкоуровневые компоненты

### Layout (Макет)
- `PageLayout` - Основной layout с header, sidebar и content
- `Header` - Шапка страницы
- `Sidebar` - Боковая панель
- `Content` - Основная область контента

### Form (Формы)
- `Button` - Кнопка (варианты: primary, success, danger, ghost)
- `Input` - Поле ввода текста
- `Select` - Выпадающий список
- `Textarea` - Многострочное поле ввода
- `Checkbox` - Чекбокс
- `Radio` - Радиокнопка
- `Label` - Метка для полей формы

### Table (Таблицы)
- `DataTable` - Таблица данных с колонками и строками

### Modal (Модальные окна)
- `Modal` - Модальное окно

### Navigation (Навигация)
- `Menu` - Меню навигации
- `Breadcrumbs` - Хлебные крошки
- `Tabs` - Вкладки

### Utility (Утилиты)
- `Card` - Карточка
- `Toast` / `ToastContainer` - Уведомления
- `Loading` - Индикатор загрузки
- `Badge` - Значок/бейдж

## API Reference

### AdminPanel

Главный компонент для создания админ-панели.

```tsx
<AdminPanel
  title?: string              // Заголовок админ-панели (по умолчанию "Админ панель")
  logo?: React.ReactNode      // Кастомный логотип
  models: AdminModel[]        // Массив моделей для отображения
  login?: {                   // Конфигурация авторизации (опционально)
    onSubmit: (username: string, password: string) => Promise<void> | void
  }
  user?: {                    // Информация о пользователе (опционально)
    name?: string             // Имя пользователя в header
    onLogout?: () => void     // Обработчик выхода
  }
/>
```

### AdminModel

Конфигурация модели данных.

```tsx
interface AdminModel<T = any> {
  name: string                           // Уникальное имя модели
  label: string                          // Отображаемое название
  service: CrudService<T>                // Сервис для работы с API
  columns: Column<T>[]                   // Колонки таблицы
  fields: FormField[]                    // Поля формы
  getItemId?: (item: T) => string | number  // Функция получения ID (опционально)
}
```

### CrudService

Класс для работы с REST API.

```tsx
new CrudService<T>({
  baseUrl: string                        // Базовый URL API
  getListUrl?: (params?: any) => string  // URL для получения списка (опционально)
  getDetailUrl?: (id) => string          // URL для получения элемента (опционально)
  getCreateUrl?: () => string            // URL для создания (опционально)
  getUpdateUrl?: (id) => string          // URL для обновления (опционально)
  getDeleteUrl?: (id) => string          // URL для удаления (опционально)
  transformRequest?: (data) => any       // Трансформация запроса (опционально)
  transformResponse?: (data) => T        // Трансформация ответа (опционально)
  headers?: Record<string, string>       // Заголовки запросов (опционально)
})
```

Методы:
- `getList(params?)` - Получить список элементов
- `getDetail(id)` - Получить элемент по ID
- `create(data)` - Создать новый элемент
- `update(id, data)` - Обновить элемент
- `delete(id)` - Удалить элемент

### Column

Конфигурация колонки таблицы.

```tsx
interface Column<T> {
  key: string                            // Уникальный ключ колонки
  title: string                          // Заголовок колонки
  dataIndex?: string                     // Поле данных для отображения
  render?: (value: any, record: T, index: number) => React.ReactNode  // Кастомный рендер
  width?: number | string                // Ширина колонки
  align?: 'left' | 'center' | 'right'   // Выравнивание
}
```

### FormField

Конфигурация поля формы.

```tsx
interface FormField {
  name: string                           // Имя поля
  label: string                          // Метка поля
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: Array<{ value: string | number; label: string }>  // Опции для select/radio
  required?: boolean                     // Обязательное поле
  placeholder?: string                   // Подсказка
  disabled?: boolean                     // Отключено
}
```

## Разработка

```bash
# Установка зависимостей
npm install

# Сборка библиотеки
npm run build

# Запуск демо приложения
npm run demo

# Линтинг
npm run lint
```

## Публикация в npm

```bash
# Убедитесь что все изменения закоммичены
git add .
git commit -m "Prepare for release"

# Обновите версию (если нужно)
npm version patch  # или minor, major

# Соберите библиотеку
npm run build

# Опубликуйте
npm publish
```

## Лицензия

MIT

