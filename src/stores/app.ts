import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  id: number
  from: string
  avatar: string
  lastMsg: string
  time: string
  unread: number
}

export interface UserInfo {
  name: string
  avatar: string
  school: string
  published: number
  sold: number
  bought: number
}

export const useAppStore = defineStore('app', () => {
  // ===== 用户信息 =====
  const user = ref<UserInfo>({
    name: '小明',
    avatar: '',
    school: '某某大学',
    published: 16,
    sold: 8,
    bought: 5,
  })

  // ===== 消息列表 =====
  const messages = ref<Message[]>([
    {
      id: 1,
      from: '大四学长',
      avatar: '',
      lastMsg: '同学你好，书还在吗？',
      time: '10分钟前',
      unread: 2,
    },
    {
      id: 2,
      from: '小李同学',
      avatar: '',
      lastMsg: '好的，明天下午3点食堂门口见',
      time: '1小时前',
      unread: 0,
    },
    {
      id: 3,
      from: '毕业生小王',
      avatar: '',
      lastMsg: '可以的，我放在北门保安室了',
      time: '昨天',
      unread: 1,
    },
    {
      id: 4,
      from: '已上岸学长',
      avatar: '',
      lastMsg: '谢谢！祝你考研顺利💪',
      time: '昨天',
      unread: 0,
    },
    {
      id: 5,
      from: '系统通知',
      avatar: '',
      lastMsg: '您的商品「高等数学」已通过审核',
      time: '3天前',
      unread: 0,
    },
  ])

  return { user, messages }
})
