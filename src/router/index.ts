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
      path: '/lost-found',
      name: 'LostFound',
      component: () => import('../views/LostFoundView.vue'),
    },
    {
      path: '/group-buy',
      name: 'GroupBuy',
      component: () => import('../views/GroupBuyView.vue'),
    },
    {
      path: '/errand',
      name: 'Errand',
      component: () => import('../views/ErrandView.vue'),
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
    {
      path: '/detail/:id?',
      name: 'Detail',
      component: () => import('../views/DetailView.vue'),
    },
  ],
})

export default router
