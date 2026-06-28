<script setup lang="ts">
// 失物招领页 - 展示失物和招领信息

const items = [
  { id: 1, type: '失物', title: '黑色钱包', location: '图书馆二楼', time: '2小时前', desc: '内有身份证和校园卡' },
  { id: 2, type: '招领', title: '一串钥匙', location: '操场入口', time: '5小时前', desc: '3把钥匙+U盘' },
  { id: 3, type: '失物', title: 'AirPods 充电盒', location: '教学楼A栋', time: '1天前', desc: '白色，有保护壳' },
  { id: 4, type: '招领', title: '学生证', location: '食堂二楼', time: '1天前', desc: '计算机学院 张同学' },
  { id: 5, type: '失物', title: '蓝色水杯', location: '体育馆', time: '2天前', desc: '膳魔师 500ml' },
  { id: 6, type: '招领', title: 'U盘 32G', location: '机房B301', time: '2天前', desc: '金士顿 银色' },
]
</script>

<template>
  <div class="lost-found-view">
    <h2 class="page-title">失物招领</h2>
    <p class="page-desc">捡到失物请发布招领信息，丢失物品请发布寻物启事</p>

    <div class="tab-row">
      <span class="tab active">全部</span>
      <span class="tab">失物</span>
      <span class="tab">招领</span>
    </div>

    <div class="item-list">
      <div v-for="item in items" :key="item.id" class="item-card card">
        <div class="item-header">
          <span class="item-type" :class="item.type === '失物' ? 'lost' : 'found'">
            {{ item.type }}
          </span>
          <span class="item-time">{{ item.time }}</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <p class="item-desc">{{ item.desc }}</p>
        <p class="item-location">📍 {{ item.location }}</p>
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
  background: #07c160;
  color: #fff;
  border-color: #07c160;
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
.item-type.lost {
  background: #fde8ec;
  color: #f56c6c;
}
.item-type.found {
  background: #e8f8ef;
  color: #07c160;
}
.item-time {
  font-size: 12px;
  color: #909399;
}
.item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}
.item-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}
.item-location {
  font-size: 12px;
  color: #909399;
}
</style>
