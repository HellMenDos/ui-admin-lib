/**
 * Утилиты для работы с CRUD операциями через API
 */

export interface CrudConfig<T = any> {
  baseUrl: string
  getListUrl?: (params?: any) => string
  getDetailUrl?: (id: string | number) => string
  getCreateUrl?: () => string
  getUpdateUrl?: (id: string | number) => string
  getDeleteUrl?: (id: string | number) => string
  transformRequest?: (data: Partial<T>) => any
  transformResponse?: (data: any) => T
  headers?: Record<string, string>
}

export class CrudService<T = any> {
  private config: Required<CrudConfig<T>>

  constructor(config: CrudConfig<T>) {
    this.config = {
      baseUrl: config.baseUrl,
      getListUrl: config.getListUrl || (() => config.baseUrl),
      getDetailUrl: config.getDetailUrl || ((id) => `${config.baseUrl}/${id}`),
      getCreateUrl: config.getCreateUrl || (() => config.baseUrl),
      getUpdateUrl: config.getUpdateUrl || ((id) => `${config.baseUrl}/${id}`),
      getDeleteUrl: config.getDeleteUrl || ((id) => `${config.baseUrl}/${id}`),
      transformRequest: config.transformRequest || ((data) => data),
      transformResponse: config.transformResponse || ((data) => data),
      headers: config.headers || {},
    }
  }

  private async request(url: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getList(params?: any): Promise<{ data: T[]; total?: number }> {
    const url = this.config.getListUrl(params)
    const data = await this.request(url)
    
    // Поддержка различных форматов ответа API
    if (Array.isArray(data)) {
      return { data: data.map((item) => this.config.transformResponse(item)) }
    }
    
    if (data.results || data.data || data.items) {
      const items = data.results || data.data || data.items
      return {
        data: items.map((item: any) => this.config.transformResponse(item)),
        total: data.total || data.count || items.length,
      }
    }

    return { data: [this.config.transformResponse(data)] }
  }

  async getDetail(id: string | number): Promise<T> {
    const url = this.config.getDetailUrl(id)
    const data = await this.request(url)
    return this.config.transformResponse(data)
  }

  async create(data: Partial<T>): Promise<T> {
    const url = this.config.getCreateUrl()
    const transformed = this.config.transformRequest(data)
    const response = await this.request(url, {
      method: 'POST',
      body: JSON.stringify(transformed),
    })
    return this.config.transformResponse(response)
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const url = this.config.getUpdateUrl(id)
    const transformed = this.config.transformRequest(data)
    const response = await this.request(url, {
      method: 'PUT',
      body: JSON.stringify(transformed),
    })
    return this.config.transformResponse(response)
  }

  async delete(id: string | number): Promise<void> {
    const url = this.config.getDeleteUrl(id)
    await this.request(url, {
      method: 'DELETE',
    })
  }
}

