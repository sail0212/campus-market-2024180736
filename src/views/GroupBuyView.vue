<script setup lang="ts">
// 拼单搭子页 - 展示拼单、搭子、组队信息

const items = [
  { id: 1, type: '拼单', title: '拼奶茶！第二杯半价', people: '2/4人', price: '¥12/人', time: '30分钟前', place: '校门口奶茶店' },
  { id: 2, type: '搭子', title: '找考研搭子，互相监督', people: '1/2人', price: '免费', time: '1小时前', place: '图书馆自习室' },
  { id: 3, type: '拼单', title: '拼外卖，满减凑单', people: '1/3人', price: '¥15/人', time: '2小时前', place: '南区食堂门口' },
  { id: 4, type: '组队', title: '王者荣耀五排缺一', people: '4/5人', price: '免费', time: '3小时前', place: '线上' },
  { id: 5, type: '拼单', title: '拼车去火车站', people: '2/4人', price: '¥20/人', time: '5小时前', place: '学校北门' },
  { id: 6, type: '搭子', title: '找健身搭子', people: '1/2人', price: '免费', time: '1天前', place: '学校健身房' },
]
</script>

<template>
  <div class="group-buy-view">
    <h2 class="page-title">拼单搭子</h2>
    <p class="page-desc">找人一起拼、一起学、一起玩，让校园生活更精彩</p>

    <div class="tab-row">
      <span class="tab active">全部</span>
      <span class="tab">拼单</span>
      <span class="tab">搭子</span>
      <span class="tab">组队</span>
    </div>

    <div class="item-list">
      <div v-for="item in items" :key="item.id" class="item-card card">
        <div class="item-header">
          <span class="item-type" :class="item.type === '拼单' ? 'ping' : item.type === '搭子' ? 'dazi' : 'team'">
            {{ item.type }}
          </span>
          <span class="item-time">{{ item.time }}</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <div class="item-meta">
          <span class="meta-tag">👥 {{ item.people }}</span>
          <span class="meta-tag">💰 {{ item.price }}</span>
          <span class="meta-tag">📍 {{ item.place }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}
.page-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
}

.tab-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  background: #fff;
  color: #606266;
  border: 1px solid #e4e7ed;
  cursor: pointer;
}
.tab.active {
  background: #e6a23c;
  color: #fff;
  border-color: #e6a23c;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-card {
  padding: 14px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.item-type {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
}
.item-type.ping { background: #fef5e7; color: #e6a23c; }
.item-type.dazi { background: #e8f8ef; color: #07c160; }
.item-type.team { background: #e8f0fe; color: #409eff; }
.item-time {
  font-size: 12px;
  color: #909399;
}
.item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}
.item-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.meta-tag {
  font-size: 12px;
  color: #606266;
  background: #f5f6fa;
  padding: 3px 8px;
  border-radius: 4px;
}
</style>
