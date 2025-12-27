import React from 'react'

export interface Column<T = any> {
  key: string
  title: string
  dataIndex?: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  className?: string
  rowKey?: string | ((record: T) => string | number)
  loading?: boolean
  onRowClick?: (record: T, index: number) => void
}

export function DataTable<T = any>({
  columns,
  data,
  className = '',
  rowKey = 'id',
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  const tableClasses = ['admin-table', className].filter(Boolean).join(' ')

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return (record as any)[rowKey] ?? index
  }

  const getCellValue = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      const value = column.dataIndex ? (record as any)[column.dataIndex] : undefined
      return column.render(value, record, index)
    }
    if (column.dataIndex) {
      return (record as any)[column.dataIndex]
    }
    return null
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          <div className="admin-loading-spinner" />
        </div>
      )}
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={getRowKey(record, index)}
              onClick={() => onRowClick?.(record, index)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    textAlign: column.align || 'left',
                  }}
                >
                  {getCellValue(column, record, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

