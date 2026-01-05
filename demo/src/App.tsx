import React from 'react'
import { AdminPanel } from 'ui-admin-lib'
import { userModel, productModel } from './config'

function App() {
  return (
    <AdminPanel
      title="Админ панель"
      models={[userModel, productModel]}
      login={{
        onSubmit: async (username, password) => {
          // Имитация задержки API
          await new Promise((resolve) => setTimeout(resolve, 1000))
          
          if (username === 'admin' && password === 'admin') {
            // Авторизация успешна
          } else {
            throw new Error('Неверное имя пользователя или пароль')
          }
        },
      }}
      user={{
        name: 'Администратор',
      }}
    />
  )
}

export default App
