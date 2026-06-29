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
  desc: string
  status: string
  views: number
}

// 获取二手交易列表
export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

// 根据 id 获取单条交易
export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}
