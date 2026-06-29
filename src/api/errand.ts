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
}

// 获取跑腿委托列表
export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

// 根据 id 获取单条
export function getErrandById(id: number) {
  return http.get<ErrandItem>(`/errands/${id}`)
}
