import { AdminModel, CrudService } from '../../src/index'
import type { Column, FormField } from '../../src/index'

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

// Мок API сервисы
class MockUserService extends CrudService<User> {
  private mockUsers: User[] = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'admin', active: true },
    { id: 2, name: 'Мария Петрова', email: 'maria@example.com', role: 'user', active: true },
    { id: 3, name: 'Петр Сидоров', email: 'petr@example.com', role: 'user', active: false },
  ]

  async getList() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: [...this.mockUsers], total: this.mockUsers.length }
  }

  async create(data: Partial<User>) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = {
      id: Math.max(...this.mockUsers.map((u) => u.id)) + 1,
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'user',
      active: data.active ?? true,
    }
    this.mockUsers.push(newUser)
    return newUser
  }

  async update(id: string | number, data: Partial<User>) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = this.mockUsers.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')
    this.mockUsers[index] = { ...this.mockUsers[index], ...data }
    return this.mockUsers[index]
  }

  async delete(id: string | number) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = this.mockUsers.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')
    this.mockUsers.splice(index, 1)
  }

  async getDetail(id: string | number) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const user = this.mockUsers.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    return user
  }
}

class MockProductService extends CrudService<Product> {
  private mockProducts: Product[] = [
    { id: 1, title: 'Ноутбук', price: 50000, category: 'Электроника', inStock: true },
    { id: 2, title: 'Мышь', price: 1000, category: 'Аксессуары', inStock: true },
    { id: 3, title: 'Клавиатура', price: 2500, category: 'Аксессуары', inStock: false },
  ]

  async getList() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: [...this.mockProducts], total: this.mockProducts.length }
  }

  async create(data: Partial<Product>) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newProduct: Product = {
      id: Math.max(...this.mockProducts.map((p) => p.id)) + 1,
      title: data.title || '',
      price: data.price || 0,
      category: data.category || '',
      inStock: data.inStock ?? true,
    }
    this.mockProducts.push(newProduct)
    return newProduct
  }

  async update(id: string | number, data: Partial<Product>) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = this.mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Product not found')
    this.mockProducts[index] = { ...this.mockProducts[index], ...data }
    return this.mockProducts[index]
  }

  async delete(id: string | number) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = this.mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Product not found')
    this.mockProducts.splice(index, 1)
  }

  async getDetail(id: string | number) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const product = this.mockProducts.find((p) => p.id === id)
    if (!product) throw new Error('Product not found')
    return product
  }
}

// Конфигурация моделей
export const userModel: AdminModel<User> = {
  name: 'users',
  label: 'Пользователи',
  service: new MockUserService({ baseUrl: '/api/users' }),
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
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
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
}

export const productModel: AdminModel<Product> = {
  name: 'products',
  label: 'Товары',
  service: new MockProductService({ baseUrl: '/api/products' }),
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

