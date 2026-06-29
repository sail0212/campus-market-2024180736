import http from './http'

export interface TradeItem {
  id: number
  title: string
  price: number
  originalPrice?: number
  category: string
  condition: string
  publisher: string
  publishTime: string
  location: string
  image: string
  images: string[]
  desc: string
  status: string
  views: number
  contact: string
  tags: string[]
  specs: Record<string, string>
  favorited: number
  tradeLocation: string
  updatedAt: string
}

export type TradeFormData = Omit<TradeItem, 'id' | 'publishTime' | 'views' | 'favorited' | 'updatedAt'>

// 获取二手交易列表
export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

// 根据 id 获取单条交易
export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}

// 创建交易
export function createTrade(data: TradeFormData) {
  return http.post<TradeItem>('/trades', data)
}

// 更新交易
export function updateTrade(id: number, data: Partial<TradeFormData>) {
  return http.put<TradeItem>(`/trades/${id}`, data)
}

// 删除交易
export function deleteTrade(id: number) {
  return http.delete(`/trades/${id}`)
}
