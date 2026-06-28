<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppNav from './AppNav.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <AppNav />
    <main class="app-main">
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
.app-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px;
}
</style>
