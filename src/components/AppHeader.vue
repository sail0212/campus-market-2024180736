<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <span class="header-icon">🏫</span>
        <h1 class="header-title">校园轻集市</h1>
        <p class="header-desc">校园二手交易 · 失物招领 · 拼单搭子 · 跑腿委托</p>
      </div>
      <div class="header-right">
        <span class="header-badge">📱 移动端适配</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 50%, #05a04b 100%);
  color: #fff;
}
.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.header-icon {
  font-size: 28px;
}
.header-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.header-desc {
  font-size: 13px;
  opacity: 0.88;
  margin: 0;
}
.header-right {
  display: flex;
  align-items: center;
}
.header-badge {
  background: rgba(255,255,255,0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
}
</style>
