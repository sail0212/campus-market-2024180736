<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getTrades, type TradeItem } from '@/api/trade'
import EmptyState from '@/components/EmptyState.vue'
import { formatTime } from '@/utils/format'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

// 当前活跃的 tab
const activeTab = ref<'published' | 'favorites'>('published')

// 我的发布 - 从二手交易中筛选当前用户发布的
const myPublished = ref<TradeItem[]>([])
const loadingPublished = ref(false)

onMounted(async () => {
  // 获取我的发布
  loadingPublished.value = true
  try {
    const res = await getTrades()
    myPublished.value = res.data.filter(
      (item) => item.publisher === userStore.user.name,
    )
  } catch (e) {
    console.error('获取我的发布失败', e)
  } finally {
    loadingPublished.value = false
  }
})

function goTradeDetail(id: number) {
  router.push(`/trade/${id}`)
}

function removeFav(id: number) {
  favoriteStore.removeFavorite(id, 'trade')
}
</script>

<template>
  <div class="user-view">
    <h2 class="page-title">个人中心</h2>

    <!-- ===== 用户资料卡片 ===== -->
    <div class="user-card card">
      <div class="user-header">
        <span class="avatar">👤</span>
        <div class="user-info">
          <h3>{{ userStore.user.name || '未登录' }}</h3>
          <p>{{ userStore.user.school }}</p>
          <p class="user-department">{{ userStore.user.department }} · {{ userStore.user.grade }}</p>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <span class="num">{{ userStore.user.published }}</span>
          <span class="lbl">发布</span>
        </div>
        <div class="stat">
          <span class="num">{{ userStore.user.sold }}</span>
          <span class="lbl">卖出</span>
        </div>
        <div class="stat">
          <span class="num">{{ userStore.user.bought }}</span>
          <span class="lbl">买入</span>
        </div>
        <div class="stat">
          <span class="num">{{ favoriteStore.favoriteCount }}</span>
          <span class="lbl">收藏</span>
        </div>
      </div>
    </div>

    <!-- ===== Tab 切换 ===== -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'published' }"
        @click="activeTab = 'published'"
      >
        📦 我的发布
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'favorites' }"
        @click="activeTab = 'favorites'"
      >
        ❤️ 我的收藏
      </button>
    </div>

    <!-- ===== 我的发布 ===== -->
    <div v-if="activeTab === 'published'" class="tab-content">
      <div v-if="loadingPublished" class="loading">加载中…</div>

      <EmptyState
        v-else-if="myPublished.length === 0"
        icon="📦"
        text="暂无发布记录"
        hint="去发布页面发布你的第一条信息吧"
      />

      <div v-else class="item-list">
        <div
          v-for="item in myPublished"
          :key="item.id"
          class="pub-item card"
          @click="goTradeDetail(item.id)"
        >
          <div class="pub-top">
            <h4>{{ item.title }}</h4>
            <span class="pub-status" :class="item.status">
              {{ item.status === 'open' ? '进行中' : '已关闭' }}
            </span>
          </div>
          <p v-if="item.desc" class="pub-desc">{{ item.desc }}</p>
          <div class="pub-meta">
            <span class="pub-price">¥{{ item.price }}</span>
            <span>{{ item.category }}</span>
            <span>{{ formatTime(item.publishTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 我的收藏 ===== -->
    <div v-if="activeTab === 'favorites'" class="tab-content">
      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        icon="❤️"
        text="暂无收藏"
        hint="去列表页面收藏你感兴趣的信息吧"
      />

      <div v-else class="item-list">
        <div
          v-for="fav in favoriteStore.favorites"
          :key="fav.type + '-' + fav.id"
          class="fav-item card"
        >
          <div class="fav-info">
            <span class="fav-type-badge">{{ fav.type === 'trade' ? '🔄' : fav.type === 'lostFound' ? '🔍' : fav.type === 'groupBuy' ? '👥' : '🏃' }}</span>
            <div class="fav-text">
              <span class="fav-title">{{ fav.title }}</span>
              <span class="fav-time">收藏于 {{ formatTime(fav.addedAt) }}</span>
            </div>
          </div>
          <button class="remove-fav-btn" @click="removeFav(fav.id)">取消收藏</button>
        </div>
      </div>
    </div>

    <!-- ===== 账户设置入口 ===== -->
    <div class="menu-card card">
      <div class="menu-item">
        <span class="menu-icon">📋</span>
        <div class="menu-text">
          <span class="menu-label">交易记录</span>
          <span class="menu-desc">购买和卖出记录</span>
        </div>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">💬</span>
        <div class="menu-text">
          <span class="menu-label">我的消息</span>
          <span class="menu-desc">私信和系统通知</span>
        </div>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">⚙️</span>
        <div class="menu-text">
          <span class="menu-label">账户设置</span>
          <span class="menu-desc">修改个人资料和密码</span>
        </div>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">❓</span>
        <div class="menu-text">
          <span class="menu-label">帮助与反馈</span>
          <span class="menu-desc">常见问题和意见反馈</span>
        </div>
        <span class="arrow">›</span>
      </div>
    </div>

    <button class="logout-btn" @click="userStore.logout()">退出登录</button>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* ===== 用户卡片 ===== */
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
.user-department {
  font-size: 12px !important;
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

/* ===== Tab 切换 ===== */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tab-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e4e7ed;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #e8f8ef;
  border-color: #07c160;
  color: #07c160;
  font-weight: 600;
}
.tab-btn:hover:not(.active) {
  border-color: #07c160;
  color: #07c160;
}

.tab-content {
  margin-bottom: 16px;
}

/* ===== 发布列表 ===== */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pub-item {
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.pub-item:hover {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}
.pub-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.pub-top h4 {
  font-size: 15px;
  font-weight: 600;
  flex: 1;
}
.pub-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
}
.pub-status.open {
  background: #e8f8ef;
  color: #07c160;
}
.pub-status.closed {
  background: #f0f0f0;
  color: #909399;
}
.pub-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pub-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.pub-price {
  font-weight: 700;
  color: #07c160;
  font-size: 14px;
}

/* ===== 收藏列表 ===== */
.fav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.fav-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.fav-type-badge {
  font-size: 22px;
  flex-shrink: 0;
}
.fav-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.fav-title {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-time {
  font-size: 12px;
  color: #909399;
}
.remove-fav-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
  background: #f5f6fa;
  color: #909399;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  white-space: nowrap;
}
.remove-fav-btn:hover {
  border-color: #f56c6c;
  color: #f56c6c;
  background: #fff5f5;
}

/* ===== 菜单 ===== */
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

/* ===== 退出按钮 ===== */
.logout-btn {
  width: 100%;
  padding: 12px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #e4e7ed;
  font-size: 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s;
}
.logout-btn:hover {
  color: #f56c6c;
  border-color: #f56c6c;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #909399;
  font-size: 14px;
}
</style>
