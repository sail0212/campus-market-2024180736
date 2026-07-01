<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <nav class="app-nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-brand">校园轻集市</router-link>
      <div class="nav-links">
        <router-link to="/trade">二手交易</router-link>
        <router-link to="/lost-found">失物招领</router-link>
        <router-link to="/group-buy">拼单搭子</router-link>
        <router-link to="/errand">跑腿委托</router-link>
        <router-link to="/publish" class="nav-publish">发布</router-link>
        <router-link to="/message">消息</router-link>
        <router-link to="/user" class="nav-user">
          <span class="user-avatar">👤</span>
          <span>{{ userStore.displayName }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.nav-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
}
.nav-brand {
  font-size: 18px;
  font-weight: 700;
  color: #07c160;
  text-decoration: none;
  white-space: nowrap;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-links a {
  padding: 8px 14px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}
.nav-links a:hover {
  color: #07c160;
  background: #f0faf4;
}
.nav-links a.router-link-active {
  color: #07c160;
  font-weight: 600;
}
.nav-publish {
  background: #07c160 !important;
  color: #fff !important;
  font-weight: 500;
}
.nav-publish:hover {
  background: #06ad56 !important;
}
.nav-user {
  display: flex;
  align-items: center;
  gap: 4px;
}
.user-avatar {
  font-size: 16px;
}
</style>
