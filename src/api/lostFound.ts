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
  desc: string
  status: string
}

// 获取失物招领列表
export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

// 根据 id 获取单条
export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}
