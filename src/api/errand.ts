import http from './http'

export interface ErrandItem {
  id: number
  title: string
  taskType: string
  category: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  publishTime: string
  desc: string
  status: string
  images: string[]
  contact: string
  urgency: 'low' | 'medium' | 'high'
  acceptor?: string
  completedAt?: string
  tags: string[]
}

export type ErrandFormData = Omit<ErrandItem, 'id' | 'publishTime' | 'acceptor' | 'completedAt'>

// 获取跑腿委托列表
export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

// 根据 id 获取单条
export function getErrandById(id: number) {
  return http.get<ErrandItem>(`/errands/${id}`)
}

// 创建
export function createErrand(data: ErrandFormData) {
  return http.post<ErrandItem>('/errands', data)
}

// 更新
export function updateErrand(id: number, data: Partial<ErrandFormData>) {
  return http.put<ErrandItem>(`/errands/${id}`, data)
}

// 删除
export function deleteErrand(id: number) {
  return http.delete(`/errands/${id}`)
}
