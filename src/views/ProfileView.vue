<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const user = store.user

const menuItems = [
  { icon: '📦', label: '我的发布', desc: '管理已发布的商品' },
  { icon: '❤️', label: '我的收藏', desc: '收藏的商品清单' },
  { icon: '📋', label: '购买记录', desc: '历史购买记录' },
  { icon: '⚙️', label: '设置', desc: '账号与隐私设置' },
]
</script>

<template>
  <div class="profile-view">
    <!-- 用户卡片 -->
    <div class="user-card card">
      <div class="user-header">
        <span class="avatar">👤</span>
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.school }}</p>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-item">
          <span class="stat-num">{{ user.published }}</span>
          <span class="stat-label">发布</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ user.sold }}</span>
          <span class="stat-label">卖出</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ user.bought }}</span>
          <span class="stat-label">买入</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list card">
      <div v-for="item in menuItems" :key="item.label" class="menu-item">
        <span class="menu-icon">{{ item.icon }}</span>
        <div class="menu-text">
          <span class="menu-label">{{ item.label }}</span>
          <span class="menu-desc">{{ item.desc }}</span>
        </div>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <button class="logout-btn">退出登录</button>
  </div>
</template>

<style scoped>
.user-card {
  margin-bottom: 16px;
}
.user-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.avatar {
  font-size: 52px;
}
.user-info h2 {
  font-size: var(--font-lg);
  font-weight: 600;
}
.user-info p {
  font-size: var(--font-sm);
  color: var(--color-text-light);
}

.stat-row {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-num {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-primary);
}
.stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.menu-list {
  margin-bottom: 24px;
  padding: 0;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background 0.2s;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background: #fafafa;
}
.menu-icon {
  font-size: 22px;
}
.menu-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.menu-label {
  font-size: var(--font-md);
  font-weight: 500;
}
.menu-desc {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
.menu-arrow {
  font-size: 20px;
  color: var(--color-text-light);
}

.logout-btn {
  width: 100%;
  padding: 12px;
  border-radius: 24px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  font-size: var(--font-md);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}
.logout-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
</style>
