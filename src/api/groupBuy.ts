import http from './http'

export interface GroupBuyParticipant {
  name: string
  joinedAt: string
}

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
  images: string[]
  contact: string
  participants: GroupBuyParticipant[]
  requirements: string
  tags: string[]
  updatedAt: string
}

export type GroupBuyFormData = Omit<GroupBuyItem, 'id' | 'publishTime' | 'currentCount' | 'participants' | 'updatedAt'>

// 获取拼单搭子列表
export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

// 根据 id 获取单条
export function getGroupBuyById(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}

// 创建
export function createGroupBuy(data: GroupBuyFormData) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}

// 更新
export function updateGroupBuy(id: number, data: Partial<GroupBuyFormData>) {
  return http.put<GroupBuyItem>(`/groupBuys/${id}`, data)
}

// 删除
export function deleteGroupBuy(id: number) {
  return http.delete(`/groupBuys/${id}`)
}
