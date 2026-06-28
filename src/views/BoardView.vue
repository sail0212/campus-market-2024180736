<script setup lang="ts">
const stats = [
  { label: '商品总数', value: 128, icon: '📦', color: '#e8f8ef', textColor: '#07c160' },
  { label: '今日新增', value: 12, icon: '📈', color: '#e8f0fe', textColor: '#409eff' },
  { label: '活跃用户', value: 56, icon: '👥', color: '#fef5e7', textColor: '#e6a23c' },
  { label: '已完成订单', value: 342, icon: '✅', color: '#fde8ec', textColor: '#f56c6c' },
]

const recentOrders = [
  { id: 1, buyer: '小李', seller: '大四学长', item: '高等数学', price: 25, time: '10分钟前' },
  { id: 2, buyer: '小王', seller: '游戏少年', item: '罗技鼠标', price: 280, time: '1小时前' },
  { id: 3, buyer: '小张', seller: '毕业生小王', item: '小台灯', price: 35, time: '3小时前' },
  { id: 4, buyer: '小明', seller: '小李同学', item: 'iPad Pro', price: 3800, time: '昨天' },
  { id: 5, buyer: '小红', seller: '音乐爱好者', item: 'AirPods Pro', price: 850, time: '昨天' },
]

// 纯 CSS 柱状图数据
const barData = [
  { day: '周一', count: 8 },
  { day: '周二', count: 15 },
  { day: '周三', count: 10 },
  { day: '周四', count: 20 },
  { day: '周五', count: 18 },
  { day: '周六', count: 22 },
  { day: '周日', count: 14 },
]
const maxCount = Math.max(...barData.map((b) => b.count))
</script>

<template>
  <div class="board-view">
    <h2 class="page-title">数据看板</h2>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div
        v-for="item in stats"
        :key="item.label"
        class="stat-card"
        :style="{ background: item.color }"
      >
        <span class="stat-icon">{{ item.icon }}</span>
        <span class="stat-value" :style="{ color: item.textColor }">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 柱状图 -->
    <div class="chart card">
      <h3>本周发布量</h3>
      <div class="bar-chart">
        <div
          v-for="b in barData"
          :key="b.day"
          class="bar-col"
        >
          <div class="bar-wrapper">
            <div
              class="bar"
              :style="{ height: (b.count / maxCount * 100) + '%' }"
            ></div>
          </div>
          <span class="bar-label">{{ b.day }}</span>
          <span class="bar-val">{{ b.count }}</span>
        </div>
      </div>
    </div>

    <!-- 最近交易 -->
    <div class="card">
      <h3>最近交易</h3>
      <div class="order-list">
        <div v-for="o in recentOrders" :key="o.id" class="order-item">
          <span class="order-icon">💰</span>
          <div class="order-info">
            <span class="order-item-name">{{ o.item }}</span>
            <span class="order-people">{{ o.buyer }} 从 {{ o.seller }} 购入</span>
          </div>
          <div class="order-right">
            <span class="order-price">¥{{ o.price }}</span>
            <span class="order-time">{{ o.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.stat-card {
  border-radius: var(--radius-md);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-icon {
  font-size: 24px;
}
.stat-value {
  font-size: 30px;
  font-weight: 700;
}
.stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.card {
  margin-bottom: 16px;
}
.card h3 {
  font-size: var(--font-md);
  font-weight: 600;
  margin-bottom: 14px;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  gap: 4px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.bar-wrapper {
  width: 100%;
  height: 110px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bar {
  width: 70%;
  max-width: 36px;
  background: linear-gradient(to top, var(--color-primary), #4cdb8a);
  border-radius: 4px 4px 0 0;
  min-height: 8px;
  transition: height 0.5s;
}
.bar-label {
  font-size: 10px;
  color: var(--color-text-light);
}
.bar-val {
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* 最近交易 */
.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
}
.order-item:last-child {
  border-bottom: none;
}
.order-icon {
  font-size: 22px;
}
.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.order-item-name {
  font-size: var(--font-sm);
  font-weight: 500;
}
.order-people {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}
.order-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.order-price {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-sm);
}
.order-time {
  font-size: 10px;
  color: var(--color-text-light);
}
</style>
