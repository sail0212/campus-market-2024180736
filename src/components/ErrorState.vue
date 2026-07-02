<script setup lang="ts">
defineProps<{
  text?: string
  showRetry?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state">
    <span class="error-icon">⚠️</span>
    <p class="error-text">{{ text || '加载失败，请检查网络连接' }}</p>
    <p class="error-hint">请确保 JSON Server 已启动（npm run mock）</p>
    <button v-if="showRetry" class="retry-btn" @click="emit('retry')">🔄 重新加载</button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  gap: 8px;
  text-align: center;
}
.error-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
.error-text {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}
.error-hint {
  font-size: var(--font-xs);
  color: var(--color-text-light);
  margin-bottom: 8px;
}
.retry-btn {
  padding: 10px 24px;
  border-radius: 20px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-sm);
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}
.retry-btn:hover {
  opacity: 0.9;
}
</style>
