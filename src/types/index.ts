// 共享类型定义

export type { TradeItem, TradeFormData } from '@/api/trade'
export type { LostFoundItem, LostFoundFormData } from '@/api/lostFound'
export type { GroupBuyItem, GroupBuyParticipant, GroupBuyFormData } from '@/api/groupBuy'
export type { ErrandItem, ErrandFormData } from '@/api/errand'

/** 发布内容类型 */
export type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

/** 发布类型标签映射 */
export const PUBLISH_TYPE_LABELS: Record<PublishType, string> = {
  trade: '二手交易',
  lostFound: '失物招领',
  groupBuy: '拼单搭子',
  errand: '跑腿委托',
}

/** 发布类型对应的路由前缀 */
export const PUBLISH_TYPE_ROUTES: Record<PublishType, string> = {
  trade: '/trade',
  lostFound: '/lost-found',
  groupBuy: '/group-buy',
  errand: '/errand',
}
