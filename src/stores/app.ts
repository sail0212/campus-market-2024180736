import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Product {
  id: number
  title: string
  price: number
  originalPrice?: number
  category: string
  desc: string
  condition: string
  seller: string
  sellerAvatar: string
  image: string
  publishTime: string
  viewCount: number
}

export interface Message {
  id: number
  from: string
  avatar: string
  lastMsg: string
  time: string
  unread: number
}

export const useAppStore = defineStore('app', () => {
  // ===== 用户信息 =====
  const user = ref({
    name: '小明',
    avatar: '',
    school: '某某大学',
    published: 12,
    sold: 8,
    bought: 5,
  })

  // ===== 商品列表 =====
  const products = ref<Product[]>([
    {
      id: 1,
      title: '高等数学第七版（上下册）',
      price: 25,
      originalPrice: 68,
      category: '教材',
      desc: '大一买的，基本全新，只有前面几页有笔记，后面都没翻过。考研换专业了用不上，便宜出给学弟学妹。',
      condition: '九成新',
      seller: '大四学长',
      sellerAvatar: '',
      image: '',
      publishTime: '2小时前',
      viewCount: 128,
    },
    {
      id: 2,
      title: 'iPad Pro 2022 11寸 128G',
      price: 3800,
      originalPrice: 6799,
      category: '数码',
      desc: '自用一年，一直带保护壳和钢化膜，屏幕无划痕，电池健康92%。送原装充电器和保护壳。',
      condition: '九五新',
      seller: '小李同学',
      sellerAvatar: '',
      image: '',
      publishTime: '3小时前',
      viewCount: 456,
    },
    {
      id: 3,
      title: '宿舍用小台灯 LED 护眼',
      price: 35,
      originalPrice: 89,
      category: '生活',
      desc: '三档调光，USB充电，触摸开关。用了不到一学期，毕业带不走。',
      condition: '八成新',
      seller: '毕业生小王',
      sellerAvatar: '',
      image: '',
      publishTime: '5小时前',
      viewCount: 89,
    },
    {
      id: 4,
      title: '秋季新款卫衣 L码 仅试穿',
      price: 59,
      originalPrice: 199,
      category: '衣物',
      desc: '买大了，仅试穿一次，吊牌已拆但衣服完好。灰色加绒款，适合175-180。',
      condition: '九九新',
      seller: '小张同学',
      sellerAvatar: '',
      image: '',
      publishTime: '1天前',
      viewCount: 210,
    },
    {
      id: 5,
      title: '考研英语红宝书套装',
      price: 40,
      originalPrice: 118,
      category: '教材',
      desc: '去年考研买的，单词背了1/3，练习题全新没写。今年上岸了，出给下一届。',
      condition: '七成新',
      seller: '已上岸学长',
      sellerAvatar: '',
      image: '',
      publishTime: '1天前',
      viewCount: 333,
    },
    {
      id: 6,
      title: '罗技 MX Master 3S 无线鼠标',
      price: 280,
      originalPrice: 599,
      category: '数码',
      desc: '实习公司发的，用了两个月，手感确实好但不太适合打游戏，换个游戏鼠标所以出。',
      condition: '九五新',
      seller: '游戏少年',
      sellerAvatar: '',
      image: '',
      publishTime: '2天前',
      viewCount: 178,
    },
    {
      id: 7,
      title: '全身镜 落地穿衣镜 40×150cm',
      price: 45,
      category: '生活',
      desc: '宿舍自用，无破损，搬家急出。镜面有点灰擦一下就好。',
      condition: '七成新',
      seller: '搬家中',
      sellerAvatar: '',
      image: '',
      publishTime: '2天前',
      viewCount: 67,
    },
    {
      id: 8,
      title: 'Apple AirPods Pro 第二代',
      price: 850,
      originalPrice: 1899,
      category: '数码',
      desc: '去年双十一购入，还在保。降噪效果很好，配件齐全，因为换了头戴式耳机所以出。',
      condition: '九成新',
      seller: '音乐爱好者',
      sellerAvatar: '',
      image: '',
      publishTime: '3天前',
      viewCount: 520,
    },
  ])

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

  // ===== 获取单个商品 =====
  function getProductById(id: number) {
    return products.value.find((p) => p.id === id) || null
  }

  return { user, products, messages, getProductById }
})
