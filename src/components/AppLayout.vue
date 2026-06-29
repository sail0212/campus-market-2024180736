<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppNav from './AppNav.vue'

const route = useRoute()
const router = useRouter()

const showBack = computed(() => route.path !== '/')

function goBack() {
  router.back()
}
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <AppNav />
    <main class="app-main">
      <div v-if="showBack" class="back-bar">
        <button class="back-btn" @click="goBack">
          <span class="back-arrow">←</span>
          <span>返回</span>
        </button>
        <button class="home-btn" @click="goHome">
          <span class="home-icon">🏠</span>
          <span>首页</span>
        </button>
        <span class="back-title">{{ route.meta?.title || '' }}</span>
      </div>
      <div class="app-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}
.app-main {
  flex: 1;
}

.back-bar {
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s;
}
.back-btn:hover {
  color: #07c160;
  border-color: #07c160;
  background: #f0faf4;
}
.back-arrow {
  font-size: 14px;
  font-weight: 700;
}
.home-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #e8f8ef;
  border: 1px solid #07c160;
  border-radius: 20px;
  font-size: 13px;
  color: #07c160;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}
.home-btn:hover {
  background: #07c160;
  color: #fff;
}
.home-icon {
  font-size: 13px;
}
.back-title {
  font-size: 13px;
  color: #909399;
}

.app-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px 20px;
}
</style>
