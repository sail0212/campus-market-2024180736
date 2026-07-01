import http from './http'

export interface CommentItem {
  id: number
  itemType: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  itemId: number
  author: string
  content: string
  time: string
}

export type CommentFormData = Omit<CommentItem, 'id' | 'time'>

/** 获取某条信息的全部评论 */
export function getComments(itemType: string, itemId: number) {
  return http.get<CommentItem[]>(
    `/comments?itemType=${itemType}&itemId=${itemId}&_sort=time&_order=asc`,
  )
}

/** 新增评论 */
export function createComment(data: CommentFormData) {
  return http.post<CommentItem>('/comments', {
    ...data,
    time: new Date().toISOString(),
  })
}
