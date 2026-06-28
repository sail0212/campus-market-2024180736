<script setup lang="ts">
// 首页 - 校园轻集市平台入口
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { name: '二手交易', icon: '🔄', desc: '闲置买卖，物尽其用', path: '/trade', color: '#e8f8ef' },
  { name: '失物招领', icon: '🔍', desc: '捡到失物，快速归还', path: '/lost-found', color: '#e8f0fe' },
  { name: '拼单搭子', icon: '👥', desc: '一起拼，更划算', path: '/group-buy', color: '#fef5e7' },
  { name: '跑腿委托', icon: '🏃', desc: '代买代办，省时省力', path: '/errand', color: '#fde8ec' },
]

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home-view">
    <!-- 欢迎区 -->
    <section class="welcome-section">
      <h2>欢迎来到校园轻集市 👋</h2>
      <p>一站式校园生活服务平台，让你的校园生活更便捷</p>
    </section>

    <!-- 业务分类入口 -->
    <section class="section">
      <h3 class="section-title">服务分类</h3>
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="category-card"
          :style="{ background: cat.color }"
          @click="goTo(cat.path)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-desc">{{ cat.desc }}</span>
        </div>
      </div>
    </section>

    <!-- 推荐信息 -->
    <section class="section">
      <h3 class="section-title">平台公告</h3>
      <div class="notice-card card">
        <p>📢 本平台仅提供信息发布服务，线下交易请注意安全</p>
        <p>✅ 建议选择校内公共场所进行当面交易</p>
        <p>🕐 平台每日 6:00—23:00 开放发布功能</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.welcome-section {
  text-align: center;
  padding: 32px 0 24px;
}
.welcome-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}
.welcome-section p {
  font-size: 14px;
  color: #909399;
}

.section {
  margin-bottom: 24px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.category-card {
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.category-card:hover {
  transform: translateY(-2px);
}
.cat-icon {
  font-size: 36px;
}
.cat-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.cat-desc {
  font-size: 12px;
  color: #909399;
}

.notice-card {
  padding: 16px;
}
.notice-card p {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
}
.notice-card p:last-child {
  margin-bottom: 0;
}
</style>
