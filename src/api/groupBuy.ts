import http from './http'

export interface GroupBuyItem {
  id: number
  title: string
  type: 'ping' | 'dazi' | 'team'
  category: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  price: string
  publishTime: string
  desc: string
  status: string
}

// 获取拼单搭子列表
export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

// 根据 id 获取单条
export function getGroupBuyById(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}
