import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/trade',
      name: 'Trade',
      component: () => import('../views/TradeView.vue'),
    },
    {
      path: '/trade/:id',
      name: 'TradeDetail',
      component: () => import('../views/TradeDetailView.vue'),
    },
    {
      path: '/lost-found',
      name: 'LostFound',
      component: () => import('../views/LostFoundView.vue'),
    },
    {
      path: '/lost-found/:id',
      name: 'LostFoundDetail',
      component: () => import('../views/LostFoundDetailView.vue'),
    },
    {
      path: '/group-buy',
      name: 'GroupBuy',
      component: () => import('../views/GroupBuyView.vue'),
    },
    {
      path: '/group-buy/:id',
      name: 'GroupBuyDetail',
      component: () => import('../views/GroupBuyDetailView.vue'),
    },
    {
      path: '/errand',
      name: 'Errand',
      component: () => import('../views/ErrandView.vue'),
    },
    {
      path: '/errand/:id',
      name: 'ErrandDetail',
      component: () => import('../views/ErrandDetailView.vue'),
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('../views/PublishView.vue'),
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/MessageView.vue'),
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/UserCenterView.vue'),
    },
    // 旧版通用详情页重定向到二手交易详情（向后兼容）
    {
      path: '/detail/:id?',
      redirect: (to) => `/trade/${to.params.id || '1'}`,
    },
  ],
})

export default router
