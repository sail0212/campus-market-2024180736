<script setup lang="ts"></script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>校园轻集市</h1>
      <p class="subtitle">AI 辅助前端工程实践种子项目</p>
    </header>

    <nav class="app-nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/list">列表</router-link>
      <router-link to="/publish">发布</router-link>
      <router-link to="/message">消息</router-link>
      <router-link to="/profile">我的</router-link>
    </nav>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
  padding: 24px 32px 16px;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.85;
}

.app-nav {
  display: flex;
  justify-content: center;
  gap: 0;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-nav a {
  padding: 12px 24px;
  text-decoration: none;
  color: #606266;
  font-size: 15px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.app-nav a:hover {
  color: #409eff;
}

.app-nav a.router-link-active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.app-content {
  flex: 1;
  padding: 20px 16px;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
