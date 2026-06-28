<script setup lang="ts">
// 用户中心 - 展示用户资料、我的发布、收藏等内容
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const user = store.user

const menus = [
  { icon: '📦', label: '我的发布', desc: '管理已发布的商品和帖子' },
  { icon: '❤️', label: '我的收藏', desc: '收藏的宝贝和帖子' },
  { icon: '📋', label: '交易记录', desc: '购买和卖出记录' },
  { icon: '💬', label: '我的消息', desc: '私信和系统通知' },
  { icon: '⚙️', label: '账户设置', desc: '修改个人资料和密码' },
  { icon: '❓', label: '帮助与反馈', desc: '常见问题和意见反馈' },
]
</script>

<template>
  <div class="user-view">
    <h2 class="page-title">个人中心</h2>

    <!-- 用户卡片 -->
    <div class="user-card card">
      <div class="user-header">
        <span class="avatar">👤</span>
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.school }}</p>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <span class="num">{{ user.published }}</span>
          <span class="lbl">发布</span>
        </div>
        <div class="stat">
          <span class="num">{{ user.sold }}</span>
          <span class="lbl">卖出</span>
        </div>
        <div class="stat">
          <span class="num">{{ user.bought }}</span>
          <span class="lbl">买入</span>
        </div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-card card">
      <div v-for="m in menus" :key="m.label" class="menu-item">
        <span class="menu-icon">{{ m.icon }}</span>
        <div class="menu-text">
          <span class="menu-label">{{ m.label }}</span>
          <span class="menu-desc">{{ m.desc }}</span>
        </div>
        <span class="arrow">›</span>
      </div>
    </div>

    <button class="logout-btn">退出登录</button>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

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
.user-info h3 {
  font-size: 18px;
  font-weight: 600;
}
.user-info p {
  font-size: 13px;
  color: #909399;
}
.stats {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.num {
  font-size: 22px;
  font-weight: 700;
  color: #07c160;
}
.lbl {
  font-size: 12px;
  color: #909399;
}

.menu-card {
  margin-bottom: 24px;
  padding: 0;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
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
  font-size: 15px;
  font-weight: 500;
}
.menu-desc {
  font-size: 12px;
  color: #909399;
}
.arrow {
  font-size: 20px;
  color: #c0c4cc;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #e4e7ed;
  font-size: 15px;
  color: #606266;
}
.logout-btn:hover {
  color: #f56c6c;
  border-color: #f56c6c;
}
</style>
