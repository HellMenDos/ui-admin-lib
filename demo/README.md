# Demo приложение UI Admin Library

Демонстрационное приложение, показывающее как просто создать админ-панель с помощью библиотеки.

## Запуск

```bash
# Из корневой директории проекта
npm run demo

# Или из директории demo
cd demo
npm install
npm run dev
```

## Доступ

- URL: http://localhost:3000
- Логин: `admin`
- Пароль: `admin`

## Структура

- `src/App.tsx` - Главный компонент (всего ~30 строк!)
- `src/config.ts` - Конфигурация моделей (сервисы, колонки, поля)
- `src/main.tsx` - Точка входа

## Как это работает

1. **App.tsx** - минимальный код, просто передает конфигурацию в `AdminPanel`
2. **config.ts** - определяет модели (User, Product) с их сервисами, колонками и полями форм
3. **AdminPanel** - автоматически создает весь интерфейс админки

## Пример кода

`App.tsx` выглядит очень просто:

```tsx
import { AdminPanel } from '../../src/index'
import { userModel, productModel } from './config'

function App() {
  return (
    <AdminPanel
      title="Админ панель"
      models={[userModel, productModel]}
      login={{
        onSubmit: async (username, password) => {
          if (username === 'admin' && password === 'admin') {
            // Авторизация успешна
          } else {
            throw new Error('Неверное имя пользователя или пароль')
          }
        },
      }}
    />
  )
}
```

Всё! AdminPanel автоматически создает весь интерфейс.

