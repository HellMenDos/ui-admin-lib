# UI Admin Library

Library for quickly creating admin panels in React with full CRUD functionality. Create a complete admin panel in just a few lines of code!

## Installation

```bash
npm install ui-admin-lib
```

## Usage

Create an admin panel in a few lines:

```tsx
import { AdminPanel, CrudService } from 'ui-admin-lib'
import 'ui-admin-lib/styles'

// 1. Create a service for working with API
const userService = new CrudService({
  baseUrl: 'https://api.example.com/users',
})

// 2. Define a model
const userModel = {
  name: 'users',
  label: 'Users',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ],
}

// 3. Use AdminPanel
function App() {
  return (
    <AdminPanel
      title="My Admin"
      models={[userModel]}
      login={{
        onSubmit: async (username, password) => {
          // Your authorization logic
        },
      }}
    />
  )
}
```

That's it! AdminPanel will automatically create:
- Login page
- Sidebar navigation
- Data tables
- Create/edit forms
- Full CRUD functionality

## Full Configuration Example

Here's a complete example with multiple models and all features:

```tsx
import { AdminPanel, CrudService, AdminModel } from 'ui-admin-lib'
import type { Column, FormField } from 'ui-admin-lib'
import 'ui-admin-lib/styles'

// Data types
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

// Create services for working with API
const userService = new CrudService<User>({
  baseUrl: 'https://api.example.com/users',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  // Optional: custom URLs for operations
  getListUrl: () => 'https://api.example.com/users',
  getDetailUrl: (id) => `https://api.example.com/users/${id}`,
  getCreateUrl: () => 'https://api.example.com/users',
  getUpdateUrl: (id) => `https://api.example.com/users/${id}`,
  getDeleteUrl: (id) => `https://api.example.com/users/${id}`,
  // Optional: data transformation
  transformRequest: (data) => data, // Transform before sending
  transformResponse: (data) => data, // Transform after receiving
})

const productService = new CrudService<Product>({
  baseUrl: 'https://api.example.com/products',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})

// User model configuration
const userModel: AdminModel<User> = {
  name: 'users',
  label: 'Users',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      key: 'active',
      title: 'Active',
      dataIndex: 'active',
      render: (value) => (value ? 'Yes' : 'No'),
    },
  ] as Column<User>[],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
      ],
    },
    { name: 'active', label: 'Active', type: 'checkbox' },
  ] as FormField[],
  // Optional: custom ID getter function
  getItemId: (item) => item.id,
}

// Product model configuration
const productModel: AdminModel<Product> = {
  name: 'products',
  label: 'Products',
  service: productService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'title', title: 'Title', dataIndex: 'title' },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      render: (value) => `$${value.toLocaleString('en-US')}`,
    },
    { key: 'category', title: 'Category', dataIndex: 'category' },
    {
      key: 'inStock',
      title: 'In Stock',
      dataIndex: 'inStock',
      render: (value) => (value ? 'Yes' : 'No'),
    },
  ] as Column<Product>[],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'category', label: 'Category', type: 'text', required: true },
    { name: 'inStock', label: 'In Stock', type: 'checkbox' },
  ] as FormField[],
}

// Usage
function App() {
  return (
    <AdminPanel
      title="Admin Panel"
      logo={<span>My Logo</span>} // Optional: custom logo
      models={[userModel, productModel]}
      login={{
        onSubmit: async (username, password) => {
          // Your authorization logic
          const response = await fetch('https://api.example.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })
          if (!response.ok) {
            throw new Error('Invalid username or password')
          }
          const data = await response.json()
          // Save token
          localStorage.setItem('token', data.token)
        },
      }}
      user={{
        name: 'Administrator', // Optional: user name in header
        onLogout: () => {
          // Optional: logout handler
          localStorage.removeItem('token')
        },
      }}
    />
  )
}
```

## Form Field Types

The following field types are supported in `FormField`:

- `text` - Text field
- `email` - Email field
- `number` - Number field
- `password` - Password field
- `textarea` - Multi-line field
- `select` - Dropdown list (requires `options`)
- `checkbox` - Checkbox
- `radio` - Radio buttons (requires `options`)

Field configuration example:

```tsx
{
  name: 'fieldName',           // Field name (required)
  label: 'Field Label',        // Field label (required)
  type: 'text',                // Field type (optional, default 'text')
  required: true,              // Required field (optional)
  placeholder: 'Hint',         // Placeholder (optional)
  disabled: false,             // Disabled (optional)
  options: [                   // Options for select/radio (required for these types)
    { value: 'value1', label: 'Label 1' },
    { value: 'value2', label: 'Label 2' },
  ],
}
```

## Quick Start

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
  label: 'Users',
  service: userService,
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ],
}

function App() {
  return <AdminPanel models={[userModel]} />
}
```

## Demo Application

Run the demo application to see all features:

```bash
git clone <repository-url>
cd ui-admin-lib
npm install
npm run demo
```

Open http://localhost:3000 in your browser.

**Login:**
- Username: `admin`
- Password: `admin`

## Core Components

### AdminPanel
Main component for creating admin panels. Accepts configuration and automatically creates:
- Login page
- Sidebar navigation
- Data tables
- Create/edit forms
- CRUD operations (Create, Read, Update, Delete)

### CrudService
Utility for working with REST API. Supports any API response formats.

### Low-level Components

### Layout
- `PageLayout` - Main layout with header, sidebar and content
- `Header` - Page header
- `Sidebar` - Sidebar panel
- `Content` - Main content area

### Form
- `Button` - Button (variants: primary, success, danger, ghost)
- `Input` - Text input field
- `Select` - Dropdown list
- `Textarea` - Multi-line input field
- `Checkbox` - Checkbox
- `Radio` - Radio button
- `Label` - Form field label

### Table
- `DataTable` - Data table with columns and rows

### Modal
- `Modal` - Modal dialog

### Navigation
- `Menu` - Navigation menu
- `Breadcrumbs` - Breadcrumb navigation
- `Tabs` - Tabs

### Utility
- `Card` - Card component
- `Toast` / `ToastContainer` - Notifications
- `Loading` - Loading spinner
- `Badge` - Badge component

## API Reference

### AdminPanel

Main component for creating admin panels.

```tsx
<AdminPanel
  title?: string              // Admin panel title (default: "Admin Panel")
  logo?: React.ReactNode      // Custom logo
  models: AdminModel[]        // Array of models to display
  login?: {                   // Authorization configuration (optional)
    onSubmit: (username: string, password: string) => Promise<void> | void
  }
  user?: {                    // User information (optional)
    name?: string             // User name in header
    onLogout?: () => void     // Logout handler
  }
/>
```

### AdminModel

Data model configuration.

```tsx
interface AdminModel<T = any> {
  name: string                           // Unique model name
  label: string                          // Display name
  service: CrudService<T>                // Service for working with API
  columns: Column<T>[]                   // Table columns
  fields: FormField[]                    // Form fields
  getItemId?: (item: T) => string | number  // ID getter function (optional)
}
```

### CrudService

Class for working with REST API.

```tsx
new CrudService<T>({
  baseUrl: string                        // Base API URL
  getListUrl?: (params?: any) => string  // URL for getting list (optional)
  getDetailUrl?: (id) => string          // URL for getting item (optional)
  getCreateUrl?: () => string            // URL for creating (optional)
  getUpdateUrl?: (id) => string          // URL for updating (optional)
  getDeleteUrl?: (id) => string          // URL for deleting (optional)
  transformRequest?: (data) => any       // Request transformation (optional)
  transformResponse?: (data) => T        // Response transformation (optional)
  headers?: Record<string, string>       // Request headers (optional)
})
```

Methods:
- `getList(params?)` - Get list of items
- `getDetail(id)` - Get item by ID
- `create(data)` - Create new item
- `update(id, data)` - Update item
- `delete(id)` - Delete item

### Column

Table column configuration.

```tsx
interface Column<T> {
  key: string                            // Unique column key
  title: string                          // Column title
  dataIndex?: string                     // Data field to display
  render?: (value: any, record: T, index: number) => React.ReactNode  // Custom render
  width?: number | string                // Column width
  align?: 'left' | 'center' | 'right'   // Alignment
}
```

### FormField

Form field configuration.

```tsx
interface FormField {
  name: string                           // Field name
  label: string                          // Field label
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: Array<{ value: string | number; label: string }>  // Options for select/radio
  required?: boolean                     // Required field
  placeholder?: string                   // Placeholder
  disabled?: boolean                     // Disabled
}
```

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run demo application
npm run demo

# Linting
npm run lint
```

## Publishing to npm

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for release"

# Update version (if needed)
npm version patch  # or minor, major

# Build library
npm run build

# Publish
npm publish
```

## License

MIT
