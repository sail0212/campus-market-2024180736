<script setup lang="ts">
// 跑腿委托页 - 展示跑腿任务与委托信息

const items = [
  { id: 1, type: '代买', title: '帮忙带一份午饭', fee: '¥5', from: '北区食堂', to: '南区宿舍', time: '20分钟前', status: '待接单' },
  { id: 2, type: '代办', title: '帮忙去教务处盖章', fee: '¥10', from: '行政楼', to: '任何地点', time: '1小时前', status: '进行中' },
  { id: 3, type: '代取', title: '帮忙取快递', fee: '¥3', from: '菜鸟驿站', to: '北区宿舍', time: '2小时前', status: '待接单' },
  { id: 4, type: '代送', title: '送一份文件到行政楼', fee: '¥8', from: '教学楼A', to: '行政楼', time: '3小时前', status: '已完成' },
  { id: 5, type: '代买', title: '帮忙买杯咖啡', fee: '¥4', from: '图书馆咖啡店', to: '图书馆3楼', time: '5小时前', status: '待接单' },
]
</script>

<template>
  <div class="errand-view">
    <h2 class="page-title">跑腿委托</h2>
    <p class="page-desc">代买、代办、代取、代送，你的校园跑腿助手</p>

    <div class="tab-row">
      <span class="tab active">全部</span>
      <span class="tab">代买</span>
      <span class="tab">代办</span>
      <span class="tab">代取</span>
      <span class="tab">代送</span>
    </div>

    <div class="item-list">
      <div v-for="item in items" :key="item.id" class="item-card card">
        <div class="item-header">
          <span class="item-type">{{ item.type }}</span>
          <span class="item-status" :class="{ done: item.status === '已完成' }">{{ item.status }}</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <div class="item-route">
          <span>{{ item.from }}</span>
          <span class="arrow">→</span>
          <span>{{ item.to }}</span>
        </div>
        <div class="item-bottom">
          <span class="item-fee">{{ item.fee }}</span>
          <span class="item-time">{{ item.time }}</span>
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
  overflow-x: auto;
}
.tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  background: #fff;
  color: #606266;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  white-space: nowrap;
}
.tab.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
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
  background: #e8f0fe;
  color: #409eff;
  font-weight: 500;
}
.item-status {
  font-size: 12px;
  color: #e6a23c;
}
.item-status.done {
  color: #909399;
}
.item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
}
.item-route {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}
.arrow {
  margin: 0 6px;
  color: #909399;
}
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-fee {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
}
.item-time {
  font-size: 12px;
  color: #909399;
}
</style>
