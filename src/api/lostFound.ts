import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  type: 'lost' | 'found'
  itemName: string
  category: string
  location: string
  eventTime: string
  publishTime: string
  contact: string
  contactPhone: string
  desc: string
  status: string
  images: string[]
  reward?: number
  claimLocation: string
  resolvedAt?: string
  finder?: string
  tags: string[]
}

export type LostFoundFormData = Omit<LostFoundItem, 'id' | 'publishTime' | 'resolvedAt'>

// 获取失物招领列表
export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

// 根据 id 获取单条
export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

// 创建
export function createLostFound(data: LostFoundFormData) {
  return http.post<LostFoundItem>('/lostFounds', data)
}

// 更新
export function updateLostFound(id: number, data: Partial<LostFoundFormData>) {
  return http.put<LostFoundItem>(`/lostFounds/${id}`, data)
}

// 删除
export function deleteLostFound(id: number) {
  return http.delete(`/lostFounds/${id}`)
}
