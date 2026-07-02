<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="loading-state">
    <span class="spinner"></span>
    <p>{{ text || '加载中…' }}</p>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  gap: 16px;
  color: var(--color-text-light);
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-state p {
  font-size: var(--font-sm);
}
</style>
